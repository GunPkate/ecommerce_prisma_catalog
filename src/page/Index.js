import axios from "axios"
import { useEffect, useState } from "react"
import config from "../config"
import Swal from "sweetalert2"
import Modal from "../component/modal"
import dayjs from "dayjs"

export default function Index(){
    const [products,setProducts] = useState([])
    const [cart,setCart] = useState([]);
    const [cartNum,setCartNum] = useState(0);
    const [sumPrice,setSumPrice] = useState(0);
    const [sumQty,setSumQty] = useState(0);
    const [formData,setFormData] = useState({
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        
    });

    useEffect(() => { 
        fetchData();
        fetchDataLocal();
        setFormData({...formData,time: getNewTime()})
    },[])

    const fetchData = async () => {

        try {
            const res = await axios.get(config.apiPath + '/product/list');
            if(res.status === 200){
                setProducts(res.data.result)
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                icon: 'warning',
                text: e.message
            })
        }
    }

    function addToCart(product){
        let arr = cart
        console.log(arr)
        if(arr == null){
            arr = []
        }
        arr.push(product)
        setCart(arr)
        setCartNum(arr.length)
        localStorage.setItem('carts',JSON.stringify(cart))

        sumCart(arr)
        setFormData({...formData,time: getNewTime()})
    }

    const getNewTime = () =>{
        let newDate = new Date()+'';
        return newDate.split(' ')[4];
    }

    const showImage = (product, fixWidth) => {
        return  product.img?
        <img className="img-fluid" alt="product" style={{maxWidth: fixWidth}} src={ config.apiPath+'/uploads/'+product.img }/>
        :<img alt="no img" src={'no_data.jpg'}/>     
    }

    const fetchDataLocal = () => {
        const itemsChart = JSON.parse(localStorage.getItem('carts'))

        if(itemsChart !== null ){

            setCart(itemsChart);
            setCartNum( itemsChart?itemsChart.length: 0)
            sumCart(itemsChart)
        }else{
            setCart([])
        }

    }
 
    const removeFromCart = (num) => {
        let temp = cart;
        temp.splice(num,1)
        console.log(temp)
        setCart(temp);
        setCartNum(temp.length)
        localStorage.setItem('carts',JSON.stringify(temp))

        sumCart(temp)
        setFormData({...formData,time: getNewTime()})
    }

    const sumCart = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i].price;
        } 
        setSumPrice(sum.toLocaleString('th-TH'))
        setSumQty(data.length)
    }

    function handleOrder(){
        console.log(formData)
    }

    return <>
        <div className="container">
            <div className="row">
                <div className="col-6 my-auto"> Product Catalog </div>
                <div className="col-6 text-right"> 
                    <button className="btn btn-outline-success" data-toggle="modal" data-target="#modalCart">
                        <i className="fa fa-shopping-cart"></i>
                        {cartNum} 
                    </button>
                </div>
            </div>
            <div className="row">
            {products?products.map(x=>{
                return <div className="col-3 mt-2" key={x.id}>
                    <div className="card">
                        {showImage(x)}
                        <div className="card-body">
                            <div>{x.name}</div>
                            <div>{x.price.toLocaleString('th-TH')}</div>
                        </div>
                        <div className="text-center">
                            <button onClick={(e)=>addToCart(x)} className="btn btn-primary mb-4"><i className="mr-3 fa fa-shopping-cart"></i>Add to Cart</button>
                        </div>
                    </div>
                </div>
            }):<> No Data </>}
            </div>
        </div>

        <Modal id="modalCart" title="Cart">
            <table className="table table-striped mt-2">
                <thead className="thead-dark">
                    <tr >
                        <th className="col-4 text-center">Name</th>
                        <th className="col-3 text-center">Price</th>
                        <th className="col-2 text-center ">Qty</th>
                        <th className="col-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cart?cart.map( (x,i)=>{
                        return <tr key={i}>
                            <td>{x.name}</td>
                            <td className="text-right ">{x.price.toLocaleString('th-TH')}</td>
                            <td className="text-right ">{1} </td>
                            <td className="text-right ">
                                <button className="btn btn-danger" onClick={(e)=>{removeFromCart(i)}}><i className="fa fa-times"></i></button>
                            </td>
                            
                        </tr>
                    }):<></>}


                    <tr>
                        <td >
                            Name
                        </td>
                        <td colSpan={3}>
                            <input onChange={(e) => {setFormData({...formData, name: e.target.value })}}/>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Adress
                        </td>
                        <td colSpan={3}>
                            <input onChange={(e) => {setFormData({...formData, address: e.target.value })}}/>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Tell NO
                        </td>
                        <td colSpan={3}>
                            <input onChange={(e) => {setFormData({...formData, tel: e.target.value })}}/>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Transaction Date
                        </td>
                        <td colSpan={3}>
                            <input value={formData.date} type="date" onChange={(e) => {setFormData({...formData, date: e.target.value })}}/>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            Time
                        </td>
                        <td colSpan={3}>
                            <input value={formData.time} onChange={(e) => {setFormData({...formData, time: e.target.value })}}/>
                        </td>
                    </tr>

                    <tr className="">
                        <td > Total </td>
                        <td className="text-right">{sumPrice}</td>
                        <td className="text-right">{sumQty}</td>
                        <td className="text-right">
                            <button className="btn btn-success" onClick={handleOrder}>Order</button>
                        </td>
                    </tr>
                </tbody>

 
            </table>
        </Modal>
    </>
}