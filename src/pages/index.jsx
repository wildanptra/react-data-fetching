import Head from 'next/head'
import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRef, useState} from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useFetchProducts } from '@/hooks/product/useFetchProducts'
import { useCreateProduct } from '@/hooks/product/useCreateProduct'
import { useDeleteProduct } from '@/hooks/product/useDeleteProduct'
import { useEditProduct } from '@/hooks/product/useEditProduct'

export default function Home() {

  const { data, isLoading: productsIsLoading, refetch: refetchProducts } = useFetchProducts()

  const toast = useToast()

  const [deletedProductId, setDeletedProductId] = useState(null)

  const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure()
  const cancelRefModalDelete = useRef()

  const formik = useFormik({
    initialValues: {
      title: "",
      price: 0,
      description: "",
      thumbnail: "",
      id: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(),
      price: yup.string().required(),
      description: yup.string().required(),
      thumbnail: yup.string().required(),
    }),
    onSubmit: () => {
      const { title, price, description, thumbnail, id } = formik.values

      if(id){
        // Melakukan PATCH /products/{id}
        editProduct({
          title,
          price,
          description,
          thumbnail,
          id,
        })
      }else{
        // Melakukan POST /products
        createProduct({
          title,
          price,
          description,
          thumbnail
        })
      }

      formik.setFieldValue("title","")
      formik.setFieldValue("price", 0)
      formik.setFieldValue("description","")
      formik.setFieldValue("thumbnail","")
      formik.setFieldValue("id","")
    }
  })

  const { mutate: createProduct, isPending: createProductIsLoading } = useCreateProduct({
    onSuccess: () => {
      toast({
        title: "Product added",
        status: "success",
      })

      refetchProducts()
    },
    onError: () => {
      toast({
        title: "Create product has an error",
        status: "error",
      })
    }
  })

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      toast({ 
        title: "Deleted Product", 
        status: "info"
      })
      onCloseModalDelete()
      refetchProducts()
    },
    onError: () => {
      toast({
        title: "Delete product has an error",
        status: "error",
      })
    }
  })

  const { mutate: editProduct, isPending: editProductIsLoading } = useEditProduct({
    onSuccess: () => {
      toast({
        title: "Product edited",
        status: "success",
      })

      refetchProducts()
    },
    onError: () => {
      toast({
        title: "Edit product has error",
        status: "error",
      })
    }
  })

  const handleFormInput = (e) => {
    formik.setFieldValue(e.target.name, e.target.value)
  }
  
  const handleFormInputCurrency = (e) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '')

    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(inputValue)

    const formattedValueWithoutSymbol = formattedValue.replace('Rp', '').trim()
    
    formik.setFieldValue(e.target.name, formattedValueWithoutSymbol)
  }

  const confirmDelete = (productId) => {
    setDeletedProductId(productId)
    onOpenModalDelete()
  }

  const handleDelete = () => {
    deleteProduct(deletedProductId)
    
  }

  const onClickEdit = (product) => {
    formik.setFieldValue("id", product.id)
    formik.setFieldValue("title", product.title)
    formik.setFieldValue("price", product.price)
    formik.setFieldValue("description", product.description)
    formik.setFieldValue("thumbnail", product.thumbnail)
  }

  const renderProducts = () => {
    return data?.data.products.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.title}</Td>
          <Td>{product.price}</Td>
          <Td>{product.description}</Td>
          <Td>
            <Button  
              onClick={() => onClickEdit(product)}
              colorScheme="yellow"
              textColor={'white'}
              mr="2"
            >
              Edit
            </Button>
            
            <Button 
              onClick={() => confirmDelete(product.id)} 
              colorScheme="red"
            >
              Delete
            </Button>
          </Td>
        </Tr>
      )
    })
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxW='container.xl' mb={10}>
          <Heading>Home Page</Heading>
          <Table mb={6}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Title</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th width='xs'>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                productsIsLoading 
                ? <Tr>
                    <Td>
                      <Spinner />
                    </Td>
                  </Tr>  
                : renderProducts()
              }
            </Tbody>
          </ Table>
          <Box padding="4" border="1px solid lightgray" borderRadius="4px" mt="8">
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <Input
                  type='hidden' 
                  onChange={handleFormInput} 
                  name="id" 
                  value={formik.values.id} 
                />

                <FormControl isInvalid={formik.errors.title}>
                  <FormLabel>Product Title</FormLabel>
                  <Input 
                    onChange={handleFormInput} 
                    name="title" 
                    value={formik.values.title} 
                  />
                  <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.price}>
                  <FormLabel>Price</FormLabel>
                  <Input 
                    onChange={handleFormInputCurrency}
                    name="price"
                    value={formik.values.price}
                  />
                  <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Input 
                    onChange={handleFormInput} 
                    name="description" 
                    value={formik.values.description} 
                  />
                  <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.thumbnail}>
                  <FormLabel>Thumbnail</FormLabel>
                  <Input 
                    onChange={handleFormInput} 
                    name="thumbnail" 
                    value={formik.values.thumbnail} 
                  />
                  <FormErrorMessage>{formik.errors.thumbnail}</FormErrorMessage>
                </FormControl>

                <Button type="submit" isDisabled={createProductIsLoading || editProductIsLoading} colorScheme="teal" mt={3}>
                  { createProductIsLoading || editProductIsLoading ? <Spinner /> : "Submit" } 
                </Button>
              </Stack>
            </form>
          </Box>
        </ Container>
      </main>

      {/* Alert Dialog Delete */}
      <AlertDialog
        isOpen={isOpenModalDelete}
        leastDestructiveRef={cancelRefModalDelete}
        onClose={onCloseModalDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can not undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRefModalDelete} onClick={onCloseModalDelete}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* End Alert Dialog Delete */}

    </>
  )
}
