import Head from 'next/head'
import {
  Button,
  Container,
  Td,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRef, useState} from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { 
  useFetchProducts, 
  useCreateProduct, 
  useDeleteProduct, 
  useEditProduct 
} from '@/hooks/product'
import HeaderPage from '@/components/HeaderPage'
import ProductTable from '@/components/ProductTable'
import ProductForm from '@/components/ProductForm'

export default function Home() {

  const toast = useToast()

  const { data, isLoading: productsIsLoading, refetch: refetchProducts } = useFetchProducts({
    onError: () => {
      toast({
        title: "An error occurred",
        status: "error",
      })
    }
  })

  const [deletedProductId, setDeletedProductId] = useState(null)

  const { isOpen: isOpenModalDelete, onOpen: onOpenModalDelete, onClose: onCloseModalDelete } = useDisclosure()
  const cancelRefModalDelete = useRef()

  const formik = useFormik({
    initialValues: {
      id: "",
      title: "",
      price: 0,
      description: "",
      thumbnail: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(),
      price: yup.string().test('not-zero', 'price is a required field', function(value){
        return value != 0 || value != '0';
      }).required(),
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

  const onClickEdit = async (product) => {
    await formik.setFieldValue("id", product.id)
    await formik.setFieldValue("title", product.title)
    await formik.setFieldValue("price", product.price)
    await formik.setFieldValue("description", product.description)
    await formik.setFieldValue("thumbnail", product.thumbnail)
    await formik.setFieldTouched(["id", "title", "price", "description", "thumbnail"], true);
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
          <HeaderPage pageName={'Home Page'} />
          <ProductTable 
            productsIsLoading={productsIsLoading} 
            renderProducts={renderProducts}
            isOpenModalDelete={isOpenModalDelete}
            onCloseModalDelete={onCloseModalDelete}
            handleDelete={handleDelete}
            cancelRefModalDelete={cancelRefModalDelete}
          />
          <ProductForm 
            formik={formik}
            createProductIsLoading={createProductIsLoading}
            editProductIsLoading={editProductIsLoading}
            handleFormInput={handleFormInput}
            handleFormInputCurrency={handleFormInputCurrency}
          />
        </ Container>
      </main>
    </>
  )
}
