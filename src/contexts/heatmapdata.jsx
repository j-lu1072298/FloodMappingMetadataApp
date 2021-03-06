import React, { Component } from 'react';
import axios from 'axios';


const HeatmapDataContext = React.createContext();

class HeatmapDataProvider extends Component {
    state = {  
        loadingCA: false,
        loadedCA: false,
        dataLoaded: false,
        dataExists: false,
        data: [], 
        categories : [
            {name: "Project Category", categoryId: "projectcat", type:"graphable", graphType:"pie"}, 
            {name: "Type of Record", categoryId: "typeofrecord", type:"graphable", graphType:"pie"}, 
            {name: "Flood Hazard Standard", categoryId: "floodhzdstd", type:"graphable", graphType:"bar"},
            {name: "Financial Support", categoryId:"financialsupport", type:"graphable", graphType:"pie"}, 
            {name: "Dataset Status", categoryId:"datasetstatus", type:"graphable", graphType:"bar"}, 
            {name: "Total Drainage Area Mapped", categoryId:"drainagearea", type:"heatmappable", graphType:"none"},
            {name: "Age of Mapping", categoryId:"lastprojupdate", type:"heatmappable", graphType:"none"}, 
            {name: "Summary Report Available", categoryId:"summreportavail", type:"graphable", graphType:"pie"}, 
            {name: "Updated Since Original", categoryId:"updatesinceorig", type:"graphable", graphType:"pie"},
            {name: "Username", categoryId: "username", type:"searchable", graphType:"none", disabled: false, value: ""},
            {name: "Project Name", categoryId: "projectname", type:"searchable", graphType:"none", disabled: false, value: ""},
            {name: "Official Watercourse Name", categoryId:"officialwcname", type:"searchable", graphType:"none", disabled: false, value: ""}, 
            {name: "Local Watercourse Name", categoryId:"localwcname", type:"searchable", graphType:"none", disabled: false, value: ""}
        ],
        reset: () => {
            //send a message to map viewer to clear coordinates
            var map = document.getElementById("FGPVheatmap"); 
            map.contentWindow.postMessage("reset map", "*"); 
            var newCategories = [...this.state.categories]; 
            newCategories.forEach((category) => {
                if (category.type === "searchable") {
                    category.disabled = false; 
                    category.value = ""
                }
            });
            this.setState({categories: newCategories}); 
        }, 
        heatmap: (categoryName) => {
            var map = document.getElementById("FGPVheatmap"); 
            map.contentWindow.postMessage(categoryName, "*");
        }, 
        setOption: (option, categoryId) => {
            var newCategories = [...this.state.categories]; 
            newCategories.forEach((category) => {
                if (category.type === "searchable") {
                    if (category.categoryId !== categoryId) {
                        category.disabled = true; 
                    }
                    else {
                        category.value = option; 
                    }
                }
            }); 
            var map = document.getElementById("FGPVheatmap"); 
            map.contentWindow.postMessage({"show": [categoryId, option]}, "*");
            this.setState({categories: newCategories}); 
        },
        advancedSearch: (data) => {            
            var map = document.getElementById("FGPVheatmap"); 
            map.contentWindow.postMessage({"showList": data}, "*");
        }


    }

    componentDidMount() {
        window.addEventListener("message", this.handleIframeMessage);
        axios.get("/api")
            .then((res) => {
                this.setState({data: res.data}); 
            });
    }
    
    //handles all communication between iframe and app
    handleIframeMessage = (e) => {
        //implement source url checking once this is up on a server
        if (e.data === "started conservation load") {
            this.setState({loadingCA: true});
        }
        if (e.data === "finished conservation load") {
            this.setState({loadingCA: false, loadedCA: true}); 
        }
    }

    render() { 
        return (<HeatmapDataContext.Provider value={this.state}>
                    {this.props.children}
                </HeatmapDataContext.Provider>);
    }
}

export {HeatmapDataProvider};
export default HeatmapDataContext;

