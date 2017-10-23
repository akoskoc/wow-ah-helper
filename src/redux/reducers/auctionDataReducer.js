const auctionDataReducer = (state, action) => ({...state, auctionData: convertToAuctionData(action.payload, state)})

const convertToAuctionData = (data, state) => {
    let NoReturns = data.match(/"return/g).length
    let returnIndex = data.indexOf('"return') + 9
    let rawData = ''
    let auctionData = {}

    /* Reduce the data to only the auction data */
    for(let i = 0; i < NoReturns; i += 1) {

        rawData = rawData.concat(
            data.slice(returnIndex, data.indexOf('-- [', returnIndex) - 4)
        )

        returnIndex = data.indexOf('"return', returnIndex) + 9

    }


    /* Modify + make array of the data then make an object out of it */
    rawData
        .replace(/},$/, '')
        .replace(/{/, '')
        .replace(/\\"/g, '')
        .split('},{')
        .map(auction => auction.split(','))
        .forEach(auction => {
            if(auctionData[auction[8]]) {
                auctionData[auction[8]].buyouts.push(+(auction[16] / auction[10]))
            } else {
                auctionData[auction[8]] = {
                    buyouts: [+(auction[16] / auction[10])]
                }
            }
        })

    /* Extra data for each auction */
    for(let auction in auctionData) {
        auctionData[auction].buyouts.sort((a, b) => a - b)
        auctionData[auction].avgBuyout = getAvgBuyout(auctionData[auction].buyouts)
        auctionData[auction].minBuyout = auctionData[auction].buyouts[0]
        auctionData[auction].medianBuyout = (auctionData[auction].buyouts[Math.floor((auctionData[auction].buyouts.length + 1)/2) - 1] + auctionData[auction].buyouts[Math.ceil((auctionData[auction].buyouts.length + 1)/2) - 1]) / 2
    }

    return auctionData
}

const getAvgBuyout = (buyouts) => buyouts.reduce((acc, curr) => +acc + +curr, 0)/buyouts.length


export default auctionDataReducer