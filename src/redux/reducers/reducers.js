const reducers = {
    loadAuctionData: (state, action) => {
        
        let auctionData = convertToAuctionData(action.payload)
        let newProfessionData = {}
        let emptyPrice = {
            minBuyout: 0,
            avgBuyout: 0,
            medianBuyout: 0,
            buyouts: [],
            amount: 0,
            calculateBy: 'medianBuyout',
            customPrice: 0
        }

        for(let profession in state.professionData) {
            newProfessionData[profession] = {}
            for(let item in state.professionData[profession]) {
                newProfessionData[profession][item] = {...state.professionData[profession][item],
                    prices: auctionData[item] ? {...auctionData[item]} : {...emptyPrice},
                    reagents: state.professionData[profession][item].reagents.map((reagent) => ({...reagent,
                        prices: auctionData[reagent.name] ? {...auctionData[reagent.name]} : {...emptyPrice},
                        chartData: auctionData[reagent.name] ? countBuyouts(auctionData[reagent.name].buyouts) : false
                    })),
                    calculateBy: 'medianBuyout',
                    chartData: auctionData[item] ? countBuyouts(auctionData[item].buyouts) : false
                }
            }
        }
        return {...state,
            professionData: newProfessionData,
        }
    },

    getDataFileName: (state, action) => ({...state,
        dataFileName: action.payload
    }),

    getProfessionData: (state, action) => ({...state,
        professionData: action.payload,
        professions: getProfessions(action.payload),
        selectedProfession: 'all'
    }),

    selectProfession: (state, action) => ({...state,
        selectedProfession: action.payload
    }),

    updateSearchTerm: (state, action) => ({...state,
        searchTerm: action.payload
    }),

    updateMinProfReq: (state, action) => ({...state,
        minProfReq: action.payload
    }),

    updateMaxProfReq: (state, action) => ({...state,
        maxProfReq: action.payload
    }),

    changeCalculateBy: (state, action) => {

        let profession
        for(let professionName in state.professionData) {
            if(state.professionData[professionName][action.payload.itemName]){
                profession = professionName
            }
        }
    
        return {...state,
            professionData: {...state.professionData,
                [profession]: {...state.professionData[profession],
                    [action.payload.itemName]: {...state.professionData[profession][action.payload.itemName],
                        calculateBy: action.payload.calculateBy,
                        prices: {...state.professionData[profession][action.payload.itemName].prices,
                            customPrice: state.professionData[profession][action.payload.itemName].prices[action.payload.calculateBy]
                        }
                    }
                }
            }
        }
    },

    changeReagentCustomPrice: (state, action) => {
        let profession
        for(let professionName in state.professionData) {
            if(state.professionData[professionName][action.payload.itemName]){
                profession = professionName
            }
        }

        return {...state,
            professionData: {...state.professionData,
                [profession]: {...state.professionData[profession],
                    [action.payload.itemName]: {...state.professionData[profession][action.payload.itemName],
                        reagents: state.professionData[profession][action.payload.itemName].reagents.map(reagent => {
                            if(reagent.name === action.payload.reagentName) {
                                let newReagent = {...reagent,
                                    prices: {...reagent.prices,
                                        customPrice: +action.payload.value
                                    }
                                }
                                return newReagent
                            }
                            return reagent
                        }),
                        calculateBy: 'customPrice'
                    }
                }
            }
        }
    }
}

export const convertToAuctionData = (data) => {
    const NoReturns = data.match(/"return/g).length
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
        .forEach(auction => {
            auction = auction.split(',')
            if(auctionData[auction[8]]) {
                for(let i = 0; i < +auction[10]; i += 1) {
                    auctionData[auction[8]].buyouts.push(+((+auction[16] / +auction[10]) / 10000).toFixed(4))
                }
            } else {
                let buyouts = []
                for(let i = 0; i < +auction[10]; i += 1) {
                    buyouts.push(+((+auction[16] / +auction[10]) / 10000).toFixed(4))
                }
                auctionData[auction[8]] = {
                    buyouts: buyouts
                }
            }
        })

    /* Extra data for each auction */
    for(let auction in auctionData) {
        auctionData[auction].buyouts = auctionData[auction].buyouts
            .filter(buyout => buyout !== 0)
            .sort((a, b) => a - b)
        auctionData[auction].avgBuyout = +getAvgBuyout(auctionData[auction].buyouts).toFixed(4)
        auctionData[auction].minBuyout = +auctionData[auction].buyouts[0]
        auctionData[auction].medianBuyout = +getMedian(auctionData[auction].buyouts)
        auctionData[auction].amount = auctionData[auction].buyouts.length
        auctionData[auction].customPrice = auctionData[auction].medianBuyout
    }

    return auctionData
}

const getAvgBuyout = (buyouts) => buyouts.reduce((acc, curr) => +acc + +curr, 0) / buyouts.length

const getMedian = (arr) =>  {
    let half = Math.floor(arr.length/2)

    if(arr.length % 2) {
        return arr[half]
    } else {
        return (arr[half-1] + arr[half]) / 2.0
    }
}

const getProfessions = (professionsData) => {
    let professions = ['all']
    for(let profession in professionsData) {
        professions.push(profession)
    }
    return professions
}

export const countBuyouts = (data) => {
    let newData = []
    let prev

    for (let i = 0; i < data.length; i++ ) {

        if (data[i] !== prev) {
            newData.push({
                price: data[i],
                amount: 1
            })

        } else {
            newData[newData.length - 1].amount += 1
        }

        prev = data[i]
    }

    return newData
}

export default reducers