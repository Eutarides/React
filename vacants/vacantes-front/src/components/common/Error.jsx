import PropTypes from 'prop-types';

const Error = (props) => {
  return (
    <div className="alert alert-danger" role="alert">
		{props.message || 'Error'}
    </div>
  )
}

Error.propTypes = {
	message: PropTypes.string.isRequired
  };

export default Error
