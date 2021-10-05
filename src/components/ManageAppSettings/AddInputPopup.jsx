import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import { useDispatch } from "react-redux";
// import { SHOW_SNACKBAR_ACTION } from "../../utils/AppConstants";
class AddInputPopup extends React.Component{
    
    static defaultProps = {
        heading: '',
        description: '',
        cancelButtonText:'',
        submitButtonText : '',
        inputText : '',
        inputType : 'dateRange'|'inputText'|'numeric_range',
        inputLabel : '',
        open : false,
        data : {},

      }
    //   dispatch = useDispatch();
    constructor(props){
        super(props);
        this.state = {
            setOpen : this.props.open,
            data : '',
            text : '',
            from : '',
            to : ''
        };
        
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.open !== prevProps.open){
            this.setState({
                ...this.state,
                setOpen : this.props.open
            })
        }
    }
    

    render(){
        let isDateRange = this.props.inputType && this.props.inputType === 'dateRange' ? true : false;
        // let isText = this.props.inputType && this.props.inputType === 'inputText' ? true : false;
        let isNumericRange = this.props.inputType && this.props.inputType === 'numeric_range' ? true : false;
        let isRange  =  isDateRange || isNumericRange;
        return (<Dialog PaperProps={{
          style:{
            boxShadow: 'none'
          }
        }} open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{this.props.heading}</DialogTitle>
          <DialogContent>
              {(this.props.description && this.props.description.length > 0) ? (  <DialogContentText>
              {this.props.description}
            </DialogContentText>): null}
          
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type={(this.props.inputType && this.props.inputType=== 'dateRange')? "date" :""}
              label={(this.props.inputType && (isRange))? "From" :this.props.label}
              InputLabelProps={{
                shrink: (this.props.inputType && (isRange))? true : false
              }}
              fullWidth
              onChange ={this.updateInput}
            />

            {
                (this.props.inputType &&(isRange)) ? (<TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    type={(this.props.inputType && isDateRange)? "date" :""}
                    label={"To"}
                    InputLabelProps={{
                        shrink: (this.props.inputType && (isRange))? true : false,
                      }}
                    fullWidth
                    onChange ={isRange ? this.updateInput : this.updateTo}
                  />) : null
            }
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {this.props.cancelButtonText}
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              {this.props.submitButtonText}
            </Button>
          </DialogActions>
        </Dialog>);
    }

    handleClickOpen = () => {
        this.setState({...this.state, setOpen: true})
      };
    
    handleClose = () => {
        this.props.onClose(this.props.data);
        this.setState({...this.state, setOpen: false})
      };

    handleSubmit = ()=>{
        if(this.props.inputType === 'inputText'){
            if(this.state.text.length<=0){
                // this.dispatch({
                //     type: SHOW_SNACKBAR_ACTION,
                //     payload: {
                //       detail: '',
                //       severity: 'error',
                //     },
                //   });
            }else{
                this.props.onDataSet(this.props.data, this.state.text);
            }
            
        }else if(this.props.inputType === 'dateRange'){

        }else if(this.props.inputType === 'numeric_range'){

        }
       
        this.handleClose();
    } 

    updateInput=(evt)=>{
        this.setState({...this.state, text : evt.target.value})   
    }

    updateFrom=(evt)=>{
        this.setState({...this.state, from : evt.target.value})   
    }
    
    updateTo=(evt)=>{
        this.setState({...this.state, to : evt.target.value})   
    }
}
export default AddInputPopup;
