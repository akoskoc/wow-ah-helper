import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* Action creators */
import {
    getDataFileName
} from './../redux/actions'

const Landing = (props) => (
    <header className='landing'>
        {console.log('landing rendering')}
        <div className="container">
            <div className="get-data">
                <p>Data is stored at:</p>
                <code><span className="highlight">YOURWOWCLIENT</span>/WTF/Account/<span className="highlight">YOURACCOUNTNAME</span>/SavedVariables/Auc-ScanData.lua</code>
                
         
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file-input">
                        <p>
                            {props.dataFileName ? props.dataFileName : 'Select Data'}
                        </p>
                    </label>
    
                    <input
                        type="file"
                        id='file-input'
                        onChange={(event) => handleFileChange(event, props.getDataFileName)}
                    />
                    <button type='submit'>Provide Data</button>
                </form>
            </div>
            <div className="landing-info">
                <h2>What to craft</h2>
                <ul>
                    <li>Use the <a href="https://wow.curseforge.com/projects/auctioneer/files" target='_blank' rel='noopener noreferrer'>Auctioneer</a> addon to scan the auction house for data.</li>
                    <li>Provide your data for this aplication to help you decide which items are profitable to craft.</li>
                </ul>
                <span id="more-info">More info</span>
            </div>
        </div>
    </header>
)

const handleSubmit = (event) => {
    event.preventDefault()
    
    /*    
    const reader = new FileReader()
    if(event.target.data.value.includes('Auc-ScanData') && event.target.data.value.includes('.lua')) {
        props.auctionDataProcessing(true)
        reader.readAsText(event.target.data.files[0])
    } else {
        alert('errur')
        props.showNotification({
            type: 'Error',
            message: 'Invalid file.'
        })
    }

    reader.addEventListener('load', (event) => {
        new Promise((resolve, reject) => {
            resolve(props.loadAuctionData(event.target.result))
        })
            .then(() => props.showNotification({
                type: 'Notification',
                message: 'Auction data loaded.'
            }))
    })
    */
    
}

const handleFileChange = (event, getDataFileName) => getDataFileName(event.target.files[0] ? event.target.files[0].name : 'Select Data')

const mapStateToProps = (state) => ({
    dataFileName: state.dataFileName
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ getDataFileName }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Landing)