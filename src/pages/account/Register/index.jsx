import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../components/Logo';
import Label from '../../../components/Label';
import TextBox from '../../../components/TextBox';
import NRCTextBox from '../../../components/NRCTextBox';
import Select from '../../../components/Select';
import SharpButton from '../../../components/SharpButton';
import FormField from '../../../components/FormField';
import FormSelect from '../../../components/FormSelect';
import axios from 'axios';

//const url ="http://localhost/lmetracker/core/data/equipments.php";
const url ="http://41.63.9.43:7002/primarydata/api/all";



function Register() {
  const [districtData, setDistrictData] = useState([]);
  const [constituenceData, setConstituenceData] = useState([]);
  //const [provinceData,setProvinceData] = useState('');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PROVINCE_DROPDOWN_ID = 'ddlprovince';
  const DISTRICT_DROPDOWN_ID = 'ddldistrict';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API call using the fetch function
        const response = await axios.get(url);
        // Check if the request was successful (status code 200-299)
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setAllData(response.data);
      } catch (error) {
        // Handle errors
        setError(error.message);
      } finally {
        // Update loading state regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount
 



  var initialData = {
    id:0,text:"Select"
  }

  const pdata =  allData.map((i)=>({
    id:i.provinceId,
    text:i.pname
  }))
  pdata.push(initialData)
  pdata.sort((a, b) => a.id - b.id);

  const handleProvince = () =>{
    const pid = document.getElementById(PROVINCE_DROPDOWN_ID).value;

    var filteredList = allData.filter(obj => obj.provinceid == pid)
    if(filteredList.length > 0){
      filteredList = filteredList[0].districtList;
      const ddata =  filteredList.map((i)=>({
        id:i.districtId,
        text:i.districtName
      }))
      ddata.push(initialData)
      ddata.sort((a, b) => a.id - b.id);
      console.log(ddata)
      setDistrictData(ddata)
    }else{
      setDistrictData([])
      setConstituenceData([])
    }
    
  }

  const handleDistrict = () =>{

    const did = document.getElementById(DISTRICT_DROPDOWN_ID).value;
    const pid = document.getElementById(PROVINCE_DROPDOWN_ID).value;
    
    const filteredDisList = allData.filter(obj => obj.provinceid == pid)[0].districtList

    var filteredConstList = filteredDisList.filter(obj => obj.districtId == did)
    if(filteredConstList.length > 0){
      filteredConstList = filteredConstList[0].constituencyList;
      const cdata =  filteredConstList.map((i)=>({
        id:i.constituencyId,
        text:i.cname
      }))
      cdata.push(initialData)
      cdata.sort((a, b) => a.id - b.id);
      setConstituenceData(cdata)
    }else{
      setConstituenceData([])
    }
    
  }

  return (
    loading ? <>Loading</>:
    <div className="mas-login">
      <div className='mas-form'>
        <div className="flex justify-center divide-inherit">
          <Logo theme="grey-color" root="/"/>
        </div>
        <div className='flex gap-5 w-full'>
          <div className="w-1/2">
            <FormField label="Email Address" id="txtemail" styles="w-full"/>
            <FormField label="First Name" id="txtfirstname" styles="w-full"/>
            <FormField label="Other Name" id="txtothername" styles="w-full"/>
            <FormField label="Last Name" id="txtlastname" styles="w-full"/>
            <FormField label="NRC Number" nrc={true} id1="txtnrc1" id2="txtnrc2" id3="txtnrc3" styles="w-full"/>
            <FormField label="Date of Birth" id="txtdob" type="date" styles="w-full"/> 
          </div>
          <div className="w-1/2">
            <FormField label="Phone Number" id="txtphonenumber" styles="w-full" />
            <FormSelect label="Province" data={pdata} styles="w-full"  />

            <Label text="Province" />
            <Select options={pdata} id="ddlprovince" styles="w-full" onchange={handleProvince}/>

            <Label text="District" />
            <Select options={districtData}  styles="w-full" onchange={handleDistrict}/>

            <Label text="Constituency" />
            <Select options={constituenceData} id='ddlconstituency' styles="w-full" />
           
            <FormField label="Password" id="txtpassword" type="password" styles="w-full"/>
            <FormField label="Confirm Password" id="txtconfirmpassword" type="password" styles="w-full"/>

          </div>
        </div>
        <div className="grid justify-items-end" >
          <SharpButton text="Save" styles="w-28 text-center uppercase p-2 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default Register;