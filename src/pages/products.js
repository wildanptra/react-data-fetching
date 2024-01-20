import Head from 'next/head'
import { Container, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useFetchProducts } from '@/hooks/product/useFetchProducts';

export default function Products() {

    const { data, isLoading } = useFetchProducts();

    const renderProducts = () => {
        return data?.data.products.map((product) => {
            return (
                <Tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.title}</Td>
                <Td>{product.price}</Td>
                <Td>{product.description}</Td>
                <Td>{product.thumbnail}</Td>
                </Tr>
            );
        });
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
                <Container>
                <Heading>Product Page</Heading>
                <Table>
                    <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Title</Th>
                        <Th>Price</Th>
                        <Th>Description</Th>
                        <Th>Thumbnail</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {
                        isLoading 
                        ? <Tr>
                            <Td>
                            <Spinner />
                            </Td>
                        </Tr>  
                        : renderProducts()
                    }
                    </Tbody>
                </ Table>
                </ Container>
            </main>
        </>
    )
}
