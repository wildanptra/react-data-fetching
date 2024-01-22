import { 
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    Spinner,
} from '@chakra-ui/react';

export default function ProductForm({
    formik,
    createProductIsLoading,
    editProductIsLoading,
    handleFormInput,
    handleFormInputCurrency
}) {

    return (
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
                    {createProductIsLoading || editProductIsLoading ? <Spinner /> : "Submit"}
                </Button>
                </Stack>
            </form>
        </Box>
    )
}
