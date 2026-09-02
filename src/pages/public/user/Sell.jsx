import { replace, useNavigate, useNavigation } from "react-router";

function Sell() {
  const navigate = useNavigate()
  return <div>
    Seller Dashboard
    <button onClick={()=> navigate("/user/sell/create",replace)}>
      Sell
    </button>
    </div>;
}

export default Sell;
