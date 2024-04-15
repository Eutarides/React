import PropTypes from 'prop-types';

const ApplicationList = ({applications,page,setPage}) => {
	return (
		<table className="table table-striped-columns">
			<thead>
				<tr>
					<th scope="col">Picture</th>
					<th scope="col">Charge</th>
					<th scope="col">Name</th>
					<th scope="col">DNI</th>
					<th scope="col">Email</th>
				</tr>
			</thead>
			<tbody>
				{applications.map((item,index) => {
					return(
						<tr key={item.job_id+index}>
							<td><img src={item.img} width={50} height={50}></img></td>
							<td>{item.title}</td>
							<td>{item.name}</td>
							<td>{item.dni}</td>
							<td>{item.email}</td>
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
									applications.length<5?(<></>) : 
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

ApplicationList.propTypes = {
	vacancies: PropTypes.array,
	applications: PropTypes.array,
	page: PropTypes.number,
	setPage: PropTypes.func,
	setVacant: PropTypes.func,
	setDeleteVacant: PropTypes.func
}


export default ApplicationList