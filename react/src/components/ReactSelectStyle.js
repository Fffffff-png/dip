export default function getStyle(){
    return(
        {
            control: (defaultStyles, state)=>(
                {
                    ...defaultStyles,
                    backgroundColor: "var(--bg-primary)",
                }
            ),
            input: (defaultStyles, state)=>(
                {
                    ...defaultStyles,
                    color:"var(--text-primary)"
                }
            ),
            menu: (defaultStyles, state)=>(
                {
                    ...defaultStyles,
                    backgroundColor: "var(--bg-secondary)"
                }
            ),
            option: (defaultStyles, state)=>(
                {
                    ...defaultStyles,
                    backgroundColor:state.isFocused ? "var(--bg-highlight)" : "var(--bg-secondary)",
                    backgroundColor:state.isSelected ? "var(--primary)" : "var(--bg-secondary)"
                }
            ),
            multiValue: (defaultStyles, state)=>(
                {
                    ...defaultStyles,
                    backgroundColor:"var(--primary)",
                    color:"var(--text-primary)"
                }
            )
        }
    )
}
