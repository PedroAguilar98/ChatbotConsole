import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;
class DocumentService {
    getDocuments = async () =>{
        const response = await axios.get(`${apiUrl}/files/byTenant/1`)
        return response.data
    }

    postDocument = async (formData: FormData) =>{
        const response = await axios.post(`${apiUrl}/files`,
            formData
        )
        return response.data
    }

    deleteDocument = async (id: number) =>{
        const response = await axios.delete(`${apiUrl}/files/${id}`
        )
        return response.data
    }
}

export const documentServices = new DocumentService()