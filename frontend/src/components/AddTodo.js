import {useState,useEffect} from 'react'
import api from '../api'



export default function AddTodo(){
    const [activity,setActivity] = useState('');
    const [activityList,setActivityList] = useState([])


    let inputBoxEmpty;

    if(activity === ''){
        inputBoxEmpty = true
    }else{
        inputBoxEmpty = false
    }

    const fetchActivity = async()=>{
        try{
        const response = await api.get('/activities')
        setActivityList(response.data)
        }catch(error){
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
        fetchDelete(id)
        .then(result=>{
            if(result.success===false){
                console.error(result.message)
            }
        })
    
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
    return(
        <>
        <div className="container" style={{marginTop:10}}>   
            <div className="mb-3">    
                <label htmlFor='activity' className="form-label"><h3>Activity</h3></label>
                <input id ='activity' className = 'form-control' type='text' value={activity} onKeyDown={handleKey} onChange={(e)=>setActivity(e.target.value)}/>
            </div>
            {inputBoxEmpty ? (
                    <button className='add-button' disabled><i className="bi bi-plus-circle"></i> Add</button>
                ):(
                    <button className="add-button" onClick={handleAdd}><i className="bi bi-plus-circle"></i>Add</button>
                    )
            }

{activityList.length > 0 ? (
                <ul>
                {activityList.map((activity)=>(
                  <li key={activity.id} style={{margin:10,padding:10}}>{activity.activity} 
                  <button style={{marginLeft:2}} className ='btn btn-success' onClick={()=>handleUpdate(activity.id)}><i class="bi bi-pencil-square"> Edit</i></button>
                  <button style={{marginLeft:5}}className="btn btn-primary" onClick={()=>handleDelete(activity.id)}><i class="bi bi-trash3"> Delete</i></button>
                  </li>
                )) 
                  }
              </ul>
        ):(
            <div>
                <i>No listed Activity present</i>
            </div>   
        )
    }
        </div> 
        </>
    )
   

}