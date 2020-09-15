import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled'

const App = () => {

    const [data, setData] = useState([]);
    const [zipcode, setZipCode] = useState('');
    const [zipcodedata, setZipCodeData] = useState({})
    const [zipcodeerrortxt, setZipCodeErrorTxt] = useState('')

    useEffect(() => {
        loadData()
    }, []);

    const loadData = () => {
        fetch("https://www.wsjwine.com/api/offer/0033008")
            .then(res => res.json())
            .then(res => setData(res.response.mainItems))
    }

    /** component style */

    const Li = styled.li`
    list-style: none;
    margin-bottom: 10px;
    `

    const Result = styled.div`    
    height: ${props => props.show ? '100%' : '0px'};
    overflow:   hidden;
    transition: all 0.5s;
    `
    const ErrorTxt = styled.p`
    color: red;
    margin-top: 5px;
    `

    const StateMsg = styled.p`
     padding: 10px;
     border: 1px solid #333;
     border-radius: 10px;
     width: 200px;
     margin-top: 0;
     background: #ffc7c7;
    `

    /** Zip code search */

    function handleZipCode(e) {
        const inputValue = e.target.value;
        setZipCode(inputValue)
    }

    useEffect(() => {
        if (zipcode.length > 4) {
            fetch(`https://www.wsjwine.com/api/address/zipcode/${zipcode}`)
                .then(res => res.json())
                .then(res => 
                    { 
                        console.log(res.response);
                        if(res.statusMessage === "successful"){
                            setZipCodeData(res.response);
                            setZipCodeErrorTxt("")
                        }
                        else{
                            setZipCodeErrorTxt("Please enter valide zipcode")
                        }
                    })
                .catch(function (err) { console.log(err); })
        }
    }, [zipcode])

    return (
        <div className="container">
            <h1>Challage 1</h1>
            <ul>
                {data.map(function (item, i) {
                    return (
                        <Li key={i}>
                            <input type="radio" name="products" defaultChecked={i === 0} id={item.product.skus[0].id} />
                            <label htmlFor={item.product.skus[0].id}>{`${item.product.name} - ${item.product.skus[0].numberOfBottles} Bottles`} <b>{`Just ${item.product.skus[0].salePrice}`}</b></label></Li>
                    )
                })}
            </ul>
            <h1>Challage 2</h1>
            <div>
                <input type="text" maxLength="5" value={zipcode} onChange={(e) => handleZipCode(e)} />
                {zipcodeerrortxt !== '' && <ErrorTxt>{zipcodeerrortxt}</ErrorTxt>}
                <Result show={zipcodedata && zipcode.length > 4}>
                    {zipcodedata.city !== undefined && <h4>City: {`${zipcodedata.city}`}</h4> }
                    {zipcodedata.stateName !== undefined && <h4>State: {`${zipcodedata.stateName}`}</h4>}
                </Result>
                {zipcode.length > 4 && zipcodedata.stateCode === 'CT' && <StateMsg>Upon completion of this form, your order will be forwarded to The Wine Cellar, located in Wallingford, CT for processing and shipping.</StateMsg>}
            </div>
        </div>
    )
}

export default App;
