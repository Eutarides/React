import PropTypes from 'prop-types';

const VacantList = ({vacancies, page, setPage, setVacant, setDeleteVacant, setSelectedJob}) => {
	return (
		<table className="table table-striped-columns">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Title</th>
					<th scope="col">Job Type</th>
					<th scope="col">City</th>
					<th scope="col">Experience</th>
				</tr>
			</thead>
			<tbody>
				{vacancies.map((item) => {
					return(
						<tr key={item.job_id}>
							<th scope="row">{item.job_id}</th>
							<td>{item.title}</td>
							<td>{item.job_type}</td>
							<td>{item.city}</td>
							<td>{item.experience}</td>
							<td>
								<button type="button" className="btn btn-info" onClick={() => setVacant(item)}>Update</button>
							</td>
							<td>
								<button type="button" className="btn btn-danger" onClick={() =>{
									setDeleteVacant(item.job_id)
								}}>Delete</button>
							</td>
							<td>
								<button type="button" className="btn btn-info" onClick={() =>{
											setSelectedJob(item.job_id)
										}}>Applications</button>
							</td>
						</tr>
					)
				})}
				<tr>
					<td colSpan={5}>
						<nav aria-label="...">
							<ul className="pagination justify-content-center">
								<li className="page-item disabled" onClick={() =>setPage(page -1)}>
									<a className="page-link">Previous</a>
								</li>
								<li className={`page-item ${page - 1 === 0 ? 'd-none' : ''}`}><a className="page-link" href="#">{page - 1}</a></li>
								<li className="page-item active" aria-current="page">
									<a className="page-link">{page}</a>
								</li>
								{
									vacancies.length<5?(<></>) : 
									<>
										<li className="page-item"><a className="page-link">{page +1}</a></li>
										<li className="page-item" onClick={() =>setPage(page +1)}>
											<a className="page-link">Next</a>
										</li> 
									</> 
								}
							</ul>
						</nav>
					</td>
				</tr>
			</tbody>
		</table>
	)
}

VacantList.propTypes = {
	vacancies: PropTypes.array,
	page: PropTypes.number,
	setPage: PropTypes.func,
	setVacant: PropTypes.func,
	setDeleteVacant: PropTypes.func,
	setSelectedJob: PropTypes.func
}


export default VacantList