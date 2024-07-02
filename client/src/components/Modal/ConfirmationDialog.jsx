import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Spinner,
} from '@chakra-ui/react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, cancelRef, isLoading  }) => {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmation
          </AlertDialogHeader>
          <AlertDialogBody>
            Êtes-vous sûr de vouloir continuer cette action ?
            {isLoading && <Spinner ml={3} />}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              Annuler
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3} isLoading={isLoading}>
              Confirmer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
