import PropTypes from 'prop-types';
import Student from "./Student"

const List = ({ students, deleteStudent, setStudent}) => {
	return (
		<div className="col-md-7">
			<div className="card">
				<div className="card-header">Lista de estudiantes</div>
				<div className="card-body">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Document</th>
								<th scope="col">Name</th>
								<th scope="col">Surname</th>
								<th scope="col">Email</th>
								<th scope="col">Phone</th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							{students && students.length?
							(
								
								students.map(est => (
									<Student student={est} key={est.id} deleteStudent={deleteStudent} setStudent={setStudent}></Student>
								))

								
							):
							(<tr>
								<th colSpan={5} scope="row">No hay estudiantes</th>
							</tr>)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

List.propTypes = {
	students: PropTypes.array.isRequired,
	deleteStudent: PropTypes.func.isRequired,
	setStudent: PropTypes.func.isRequired
};

export default List