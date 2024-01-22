import { 
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
} from '@chakra-ui/react';
import AlertDialogDelete from './AlertDialogDelete';

export default function ProductTable ({ 
  productsIsLoading, 
  renderProducts, 
  isOpenModalDelete,
  onCloseModalDelete,
  handleDelete,
  cancelRefModalDelete
}) {

  return (
    <>
      <Table mb={10}>
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
          {productsIsLoading ? (
            <Tr>
              <Td colSpan={5}>
                <Center>
                  <Spinner />
                </Center>
              </Td>
            </Tr>
          ) : (
            renderProducts()
          )}
        </Tbody>
      </Table>

      <AlertDialogDelete 
        isOpen={isOpenModalDelete} 
        onClose={onCloseModalDelete} 
        handleDelete={handleDelete} 
        cancelRefModalDelete={cancelRefModalDelete}/>
    </>
  );
};
