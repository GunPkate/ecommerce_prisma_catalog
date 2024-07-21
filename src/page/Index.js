import axios from "axios"
import { useEffect, useState } from "react"
import config from "../config"
import Swal from "sweetalert2"

export default function Index(){
    const [products,setProducts] = useState()
    const [cart,setCart] = useState([]);
    const [cartNum,setCartNum] = useState(0);

    useEffect(() => { fetchData() },[])

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
        arr.push(product)
        setCart(arr)
        setCartNum(arr.length)
    }

    const showImage = (product, fixWidth) => {
        return  product.img?
        <img className="img-fluid" alt="product" style={{maxWidth: fixWidth}} src={ config.apiPath+'/uploads/'+product.img }/>
        :<img alt="no img" src={'no_data.jpg'}/>     
    }

    return <>
        <div className="container">
            <div className="row">
                <div className="col-6 my-auto"> Product Catalog </div>
                <div className="col-6 text-right"> 
                    <button className="btn btn-outline-success">
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
                            <div>{x.price}</div>
                        </div>
                        <div className="text-center">
                            <button onClick={(e)=>addToCart(x)} className="btn btn-primary mb-4"><i className="mr-3 fa fa-shopping-cart"></i>Add to Cart</button>
                        </div>
                    </div>
                </div>
            }):<> No Data </>}
            </div>
        </div>
    </>
}