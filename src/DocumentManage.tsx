import { useEffect, useState } from "react"
import { documentServices } from "./services/DocumentService"

import {
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileImage,
    FaFileArchive,
    FaFileAlt,
    FaFile
} from "react-icons/fa";

import ControlPointIcon from '@mui/icons-material/ControlPoint';

import CloseIcon from '@mui/icons-material/Close';

export const DocumentManage = () =>{
    const [files, setFiles] = useState([])
    const getDocuments = async() => {
        await documentServices.getDocuments().then(res=>{
            setFiles(res.files)
        })
    }

    useEffect(()=>{
        getDocuments()
    },[])

    const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        const formData:FormData = new FormData()
        formData.append('file', file)
        await documentServices.postDocument(formData).then(()=>{
            getDocuments()
        })

    }

    const onDeleteFile = async (fileId: number) => {
        await documentServices.deleteDocument(fileId).then(()=>{
            getDocuments()
        })
    }

    return(
        <div>
            <div style={{
                    display:"flex", 
                    flexDirection:"column", 
                    flexWrap:'wrap', 
                    borderStyle:'solid', 
                    borderWidth:1, 
                    borderColor:'#E0E0E0', 
                    padding:10,
                }}>
                <div style={{
                    display:"flex", 
                    flexDirection:"row", 
                    flexWrap:'wrap'
                }}>
                    {
                        files.map((file: any, index: number) => (
                            file.stored_name &&
                            <div 
                                key={index} 
                                style={{display:"flex", flexDirection:"column", margin:15, maxWidth:150, alignItems:'center'}} 
                            >
                                <CloseIcon style={{alignSelf:"flex-end", cursor:'pointer'}} onClick={()=>onDeleteFile(file.id)}/>
                                <div 
                                    style={{display:"flex", flexDirection:"column", cursor:'pointer', alignItems:'center'}}
                                    onClick={()=>window.open(`http://localhost:3000/uploads/${file.stored_name}`)}
                                >
                                    {
                                        file.mime_type === 'application/pdf' ?
                                        <FaFilePdf size={60} color="#E53935" /> :
                                        file.mime_type === "text/plain" ?
                                        <FaFileAlt size={60} /> :
                                        file.mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                        <FaFileWord size={60} color="#1976D2" /> :
                                        <FaFile size={60} />
                                    }
                                    <label style={{textAlign:"center", wordWrap:"break-word", cursor: 'inherit', marginTop:5}}>
                                        {file.name}
                                    </label>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div style={{textAlign:'center'}}>
                    <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
                        <ControlPointIcon style={{ fontSize: 40 }} />
                    </label>

                    <input
                        id="upload-file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleUploadDoc}
                    />
                </div>
            </div>
        </div>
    )
}