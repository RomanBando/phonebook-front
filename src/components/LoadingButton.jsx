import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingButton({loading, children, disabled, ...props}) {
  return (
    <Button 
      disabled={loading ? true : disabled}
      {...props}
    >
      {loading
        ? (
          <>
            <Spinner animation="border" role="status" />
            {' '}
            {children}
          </>
        ) : children}
    </Button>
  )
}