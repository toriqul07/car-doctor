import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import BookingRow from "./BookingRow";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";



const Bookings = () => {
    const { user } = useContext(AuthContext);
    // const url = `http://localhost:5000/bookings?email=${user?.email}`;
    const url = `/bookings?email=${user?.email}`;
    const [bookings, setBookings] = useState([]);
    const axiosSecure=useAxiosSecure();
    useEffect(() => {
        // axios.get(url,{withCredentials:true}).then(res=>{
        //     setBookings(res.data);
        // })
        // fetch(url).then(res => res.json()).then(data => setBookings(data))
        axiosSecure.get(url).then(res=>{
                setBookings(res.data);
            })
    }, [url,axiosSecure])
    const handleDelete= id =>{
        const proceed=confirm('Are You want to Delete');
        if(proceed)
        {
            fetch(`http://localhost:5000/bookings/${id}`,{
                method:'DELETE'
            }).then(res=>res.json()).then(data=>{
                console.log(data);
                if(data.deletedCount>0)
                {
                    alert('deleted sucessFully');
                    const remaining=bookings.filter(booking=>booking._id!==id);
                    setBookings(remaining);
                }
            })
        }
    }
    const handleBookingConfirm=id=>{
         fetch(`http://localhost:5000/bookings/${id}`,{
            method:'PATCH',
            headers:{
                'content-type':'application/json',
                
            },
            body:JSON.stringify({status:'confirm'})
         }).then(res=>res.json()).then(data=>{
            console.log(data);
            if(data.modifiedCount>0)
            {
                //update state
                const remaining=bookings.filter(booking=>booking._id!==id);
                const updated=bookings.find(booking=>booking._id===id);
                updated.status='confirm'
                const newBookings=[updated,...remaining];
                setBookings(newBookings);
            }
         })
    }
    return (
        <div>
            <h2 className="text-3xl">Bookings:{bookings.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings.map(booking=><BookingRow
                            key={booking._id}
                            booking={booking}
                            handleDelete={handleDelete}
                            handleBookingConfirm={handleBookingConfirm}
                            ></BookingRow>)
                        }
                    </tbody>
                    
                </table>
            </div>
        </div>
    );
};

export default Bookings;