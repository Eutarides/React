import PropTypes from 'prop-types';

const Error = ({message}) => {
	return (
		<div className="alert alert-danger" role="alert">
		<strong>Error:</strong>
		{message}
		</div>
	)
}

Error.propTypes = {
	message: PropTypes.string.isRequired
};

export default Error