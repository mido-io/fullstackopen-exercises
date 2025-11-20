import axios from "axios"

const baseURL = "http://localhost:3001/persons"

const getAll = () => {
    return axios.get(baseURL).then(res => res.data)
}

const create = (newPerson) => {
    return axios.post(baseURL, newPerson).then(res => res.data)
}

const remove = (id) => {
  return axios.delete(`${baseURL}/${id}`)
}

const update = (id, person) => {
    return axios.put(`${baseURL}/${id}`, person).then(res => res.data)
}

export default {
    getAll,
    create,
    remove, 
    update
}

