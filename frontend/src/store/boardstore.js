import { create } from "zustand";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import { isPointNearElement } from "../utils/element";

export const boardstore = create((set,get)=>({
    activetoolitem:TOOL_ITEMS.BRUSH,
    toolactiontype:TOOL_ACTION_TYPES.NONE,
    elements:[],
    history:[[]],
    index:0,
    canvasid:'',
    isuserloggedin:false,

    changetool:(tool)=>set({
        activetoolitem:tool
    }),
    setcanvasid:(canvasId)=>set({
        canvasId
    }),
    setuserloggedin:(status)=>({
        isuserloggedin:status
    }),
    setelements:(elements)=>({
        elements:elements
    }),
    sethistory:(elements)=>({
        history:[elements]
    }),
    boardmousedown:({clientx,clienty,fill,stroke,size})=>{
        const{activetoolitem,elements} = get()
        const newelement = createelement(
            elements.length,
            clientx,
            clienty,
            clientx,
            clienty,{
                type:activetoolitem,
                fill,
                stroke,
                size
            }
        )
        console.log(newelement);
        set({
            toolactiontype:activetoolitem===TOOL_ITEMS.TEXT?TOOL_ACTION_TYPES.WRITING:TOOL_ACTION_TYPES.DRAWING,
            elements:[...elements,newelement]
        })
    },
    boardmouseup:()=>{
        const{history,index,elements,toolactiontype} = get();
        if(toolactiontype===TOOL_ACTION_TYPES.WRITING) return
        const newhistory = [...history.slice(0,index+1),elements]
        set({
            history:newhistory,
            index:index+1,
            toolactiontype:TOOL_ACTION_TYPES.NONE
        })
    },
    eraseatapoint: ({ clientX, clientY }) => {
        const { elements, history, index } = get();
        const newElements = elements.filter(el => !isPointNearElement(el, clientX, clientY));
        const newHistory = [...history.slice(0, index + 1), newElements];
        set({
          elements: newElements,
          history: newHistory,
          index: index + 1,
        });
      },
      
    changetext:(text)=>{
        const{elements,history,index} = get()
        const updated = [...elements];
        updated[updated.length-1].text =text
       const newhistory=[...history.slice(0,index+1),updated]
        set({
            elements:updated,
            history:newhistory,
            index:index+1,
            toolactiontype:TOOL_ACTION_TYPES.NONE
        })
    },
    undo:()=>{
        const{history,index} = get()
        if(index<=0) return
        set({
            elements:history[index-1],
            index:index-1
        })
    },
    redo:()=>{
        const{history,index} = get()
        if(index>=history.length-1) return
        set({
            elements:history[index+1],
            index:index+1
        })
    }
}))