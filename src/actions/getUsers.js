
const getUsers = () => {
    return new Promise( (resolve, reject) =>{
        fetch('http://192.168.135.1:3000/users/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => resolve(data),
        )
        .catch(error => console.log(error));
    })
}
export default getUsers