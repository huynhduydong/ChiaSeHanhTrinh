import React from "react"
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from "react-native"
import { useEffect, useState } from "react/cjs/react.production.min"
import API, { endpoints } from "../../configs/API"



const Home = () => {
    const [journeys, setJourneys] = React.useState(null)

    React.useEffect(() => {
        const loadCourses = async () => {
            try {
                let res = await API.get(endpoints['journeys']);
                setJourneys(res.data.results)
            } catch (ex) {
                console.error(ex);
            }
        }

        loadCourses();
    }, []);

    return (
        // <View style={{marginTop: 50}}>

        //     <ScrollView>
        //     {journeys===null?<ActivityIndicator/>:<>
        //         {journeys.map(c => (
        //             <View  key={c.id} style={{flex: 1, flexDirection: "row"}}>
                       
        //                 <TouchableOpacity>
        //                 <Text style={{margin: 10}}>{c.name}</Text>
        //                 </TouchableOpacity>
        //             </View>
        //         ))}
        //     </>}
        //     </ScrollView>
        // </View>
        <Text >Donglon12</Text>
    )
}

export default Home