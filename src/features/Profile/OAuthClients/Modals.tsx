import * as React from 'react';
import { compose } from 'recompose';

import ActionsPanel from 'src/components/ActionsPanel';
import Button from 'src/components/Button';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import Typography from 'src/components/core/Typography';
import Notice from 'src/components/Notice';

interface Props {
  secretID?: string;
  secret: string;
  label: string;
  modalErrors?: Linode.ApiFieldError[];
  secretModalOpen: boolean;
  deleteModalOpen: boolean;
  secretSuccessOpen: boolean;
  closeDialogs: () => void;
  resetClient: (id?: string) => void;
  deleteClient: (id?: string) => void;
  isResetting: boolean;
  isDeleting: boolean;
}

type CombinedProps = Props;

const Modals: React.FC<CombinedProps> = props => {
  const { modalErrors, label, resetClient, isResetting, closeDialogs } = props;

  return (
    <React.Fragment>
      <ConfirmationDialog
        title="Client Secret"
        actions={clientSecretActions({
          closeDialogs
        })}
        open={props.secretSuccessOpen}
        onClose={props.closeDialogs}
      >
        <Typography variant="body1">
          {`Here is your client secret! Store it securely, as it won't be shown again.`}
        </Typography>
        <Notice typeProps={{ variant: 'body1' }} warning text={props.secret} />
      </ConfirmationDialog>

      <ConfirmationDialog
        error={modalErrors ? modalErrors[0].reason : undefined}
        title={`Delete ${label}?`}
        open={props.deleteModalOpen}
        actions={deleteDialogActions({
          loading: props.isDeleting,
          deleteSecret: () => props.deleteClient(props.secretID),
          closeDialogs
        })}
        onClose={props.closeDialogs}
      >
        <Typography>
          Are you sure you want to permanently delete this app?
        </Typography>
      </ConfirmationDialog>

      <ConfirmationDialog
        error={modalErrors ? modalErrors[0].reason : undefined}
        title={`Reset secret for ${label}?`}
        open={props.secretModalOpen}
        actions={resetDialogActions({
          closeDialogs,
          resetSecret: () => resetClient(props.secretID),
          loading: isResetting
        })}
        onClose={props.closeDialogs}
      >
        <Typography>
          Are you sure you want to permanently reset the secret for this app?
        </Typography>
      </ConfirmationDialog>
    </React.Fragment>
  );
};

export default compose<CombinedProps, Props>(React.memo)(Modals);

interface ActionsProps {
  resetSecret: () => void;
  closeDialogs: () => void;
  loading: boolean;
}

const resetDialogActions = ({
  closeDialogs,
  resetSecret,
  loading
}: ActionsProps) => {
  return (
    <React.Fragment>
      <ActionsPanel>
        <Button onClick={closeDialogs} buttonType="cancel" data-qa-button-cancel>
          Cancel
        </Button>
        <Button
          destructive
          buttonType="secondary"
          onClick={resetSecret}
          data-qa-button-confirm
          loading={loading}
        >
          Reset Secret
        </Button>
      </ActionsPanel>
    </React.Fragment>
  );
};

interface DeleteActionsProps {
  deleteSecret: () => void;
  closeDialogs: () => void;
  loading: boolean;
}

const deleteDialogActions = ({
  loading,
  deleteSecret,
  closeDialogs
}: DeleteActionsProps) => {
  return (
    <React.Fragment>
      <ActionsPanel>
        <Button onClick={closeDialogs} buttonType="cancel" data-qa-button-cancel>
          Cancel
        </Button>
        <Button
          destructive
          buttonType="secondary"
          onClick={deleteSecret}
          data-qa-button-confirm
          loading={loading}
        >
          Delete
        </Button>
      </ActionsPanel>
    </React.Fragment>
  );
};

const clientSecretActions = (props: { closeDialogs: () => void }) => (
  <Button
    buttonType="primary"
    onClick={props.closeDialogs}
    data-qa-close-dialog
  >
    Got it!
  </Button>
);
