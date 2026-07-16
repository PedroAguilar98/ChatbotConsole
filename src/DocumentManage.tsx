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

import CircularProgress from '@mui/material/CircularProgress';

import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

export const DocumentManage = () =>{
    const [files, setFiles] = useState([])
    const [addingDoc, setAddingDoc] = useState(false)
    const [gettingDocs, setGettingDocs] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [fileToDelete, setFiletToDelete] = useState<number | null>(null)
    
    const getDocuments = async() => {
        setGettingDocs(true)
        await documentServices.getDocuments().then(res=>{
            setFiles(res.files)
        }).finally(()=>{
            setGettingDocs(false)
        })
    }

    useEffect(()=>{
        getDocuments()
    },[])

    useEffect(()=>{
        if(fileToDelete){
            setOpenDeleteDialog(true)
        }
    }, [fileToDelete])

    const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        const formData:FormData = new FormData()
        formData.append('file', file)
        setAddingDoc(true)
        await documentServices.postDocument(formData).then(()=>{
            getDocuments()
        }).finally(()=>{
            setAddingDoc(false)
        })

    }

    const onDeleteFile = async () => {
        if(fileToDelete)
        await documentServices.deleteDocument(fileToDelete).then(()=>{
            getDocuments()
        }).finally(()=>{
            setOpenDeleteDialog(false)
            setFiletToDelete(null)
        })
    }

    const onCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setFiletToDelete(null)
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
                {gettingDocs ? (
                    <div style={{textAlign:'center'}}>
                        <CircularProgress />
                    </div>
                ) :
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
                                <CloseIcon style={{alignSelf:"flex-end", cursor:'pointer'}} onClick={()=>setFiletToDelete(file.id)}/>
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
                </div>}
                {addingDoc ? (
                    <div style={{textAlign:'center'}}>
                        <CircularProgress />
                    </div>
                ) :
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
                </div>}
            </div>
            <Dialog open={openDeleteDialog} onClose={onCloseDeleteDialog}>
                <DialogContent>
                    <p>¿Está seguro de que desea eliminar este archivo?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={onDeleteFile} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}