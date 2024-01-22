import { AlertDialog,
   AlertDialogBody,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   Button } from '@chakra-ui/react';

export default function AlertDialogDelete ({ isOpen, onClose, handleDelete, cancelRefModalDelete }){

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRefModalDelete}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You cannot undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRefModalDelete} onClick={onClose}>Cancel</Button>
            <Button colorScheme='red' onClick={handleDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
