import {useState,useEffect,useRef} from 'react';
import Dialog from './Dialog';
import {getActivities} from '../api';
import { useNavigate } from 'react-router-dom';
import api from '../api'


export default function AddTodo(){
    const [activity,setActivity] = useState('');
    const [activityList,setActivityList] = useState([])
    const [isCompleted,setIsCompleted] = useState(false)
    const [deleteDialog,setDeleteDialog] = useState(false);
    const activityToDelete = useRef(null)
    const navigate = useNavigate()
    const now = new Date()


    const fetchActivity = async()=>{
        try{
            
            const token = localStorage.getItem('token');
            if(!token){
                throw new Error('No token found')
                
            }
        const response = await getActivities(token)
        setActivityList(response.data)
        }catch(error){
            if(error.response?.status === 401){
                localStorage.removeItem('token')
                navigate('/login/')
            }
            console.error(error?.message ||'Failed to retrieve activities' )
            return {success:false, message:error?.message}
                   
        }
    }

    
    
    useEffect(()=>{
    
        fetchActivity()
    
    },[])
    
    const fetchDelete = async(id)=>{
        try{
            const response = await api.delete(`activities/${id}`)
            setActivityList(prev=>prev.filter(activity=>activity.id !== id))
            return response.data
            }catch(error){
                console.error(error?.message || 'failed to delete activity')
                return {success:false, message:error?.message}
            }
    }
    
    const fetchUpdate = async(id,updatedData)=>{
        try{
            const response = await api.put(`activities/${id}`,updatedData)
            setActivityList(prev =>prev.map(activity=>(
                activity.id === id ? {...activity, ...updatedData} : activity
            )))
    
            return response.data
        }catch(error){
            console.error(error?.message || 'failed to update activity')
            return{success:false, message:error?.message}
        }
    }
    function handleDelete(id){
        activityToDelete.current = id
        setDeleteDialog(true)


    
    }
    
    function handleUpdate(id){
        const updatedActivity = prompt('Enter new activity: ')
        if(!updatedActivity) return
    
        const updatedData = {activity: updatedActivity}
        fetchUpdate(id,updatedData)
        .then(result=>{
            if(result.success === false){
                console.error(result.message)
            }
        })
    }

    const postActivity = async(activity)=>{
        try{
            const response = await api.post('/activities/',{activity:activity})
            return response.data
        }catch(error){
            return {success:false,message:error?.message}
        }

    }

    const handleAdd = async()=>{
    try {
        const response = await postActivity(activity);
        setActivityList(prevList => [...prevList,response]); 
        setActivity(''); 
    } catch (error) {
        console.error(error.message);
    }

    }
    const handleKey = (e)=>{
        if(e.key === 'Enter'){
            handleAdd()
        }else if(e.key === 'Escape'){
            setActivity('')
        }
    }

    function handleDeleteYes(id){
        fetchDelete(id)
        .then(result=>{
            if(result.success===false){
                console.error(result.message)
            }
            setDeleteDialog(!deleteDialog)

        })
    }

    function handleLogout(){
        localStorage.removeItem('token')
        navigate('/login')
    }

    const DeleteModal =()=>{
        return(
            <>
                <Dialog>
                <i class="bi bi-exclamation-circle" style={{fontSize:'2em',color:"red"}}></i>
                <p>Are you sure you want to delete added activity?</p>
                <div className="modal-btns">
                    <button className="btn-yes" onClick={()=>handleDeleteYes(activityToDelete.current)}>Yes</button>
                    <button className="btn-no" onClick={()=>setDeleteDialog(false)}>No</button>
                </div>
                </Dialog>
            </>
        )
    }
    return(
        <>
        <div className="container" style={{marginTop:10}}>
            <div className='d-flex justify-content-end'>
                        <button className='logout-btn' onClick={handleLogout}>Log out</button>
            </div>
            <div className="mb-3">
                <label htmlFor='activity' className="form-label"><h3>Activity</h3></label>
                <input id ='activity' className = 'form-control' type='text' value={activity} onKeyDown={handleKey} onChange={(e)=>setActivity(e.target.value)}/>
            </div>
            <div>
            <button className="add-button" onClick={handleAdd}><i className="bi bi-plus-circle"></i>Add</button>
            </div>
            <h1>To-Do Activities</h1>
{activityList.length > 0 ? (
                <ul>
                {activityList.map((activity)=>(
                  <li key={activity.id} style={{textDecoration: isCompleted ? 'line-through':'none',margin:10,padding:10}}>{now.toLocaleTimeString()} {activity.activity} 
                  <button style={{marginLeft:2}} className ='btn btn-success' onClick={()=>handleUpdate(activity.id)}><i class="bi bi-pencil-square"> Edit</i></button>
                  <button style={{marginLeft:5}}className="btn btn-primary" onClick={()=>handleDelete(activity.id)}><i class="bi bi-trash3"> Delete</i></button>
                  </li>
                )) 
                  }
              </ul>
        ):(
            <div>
                <i>No listed Activity added</i>
            </div>   
        )
    }

    {deleteDialog && 
    
        (<DeleteModal/>)
    
    }
        </div> 
        </>
    )
   

}