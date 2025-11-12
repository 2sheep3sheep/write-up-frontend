
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackArrow(props) {
    return (
        <button className='back-arrow' onClick={props.onClick}>
            <ArrowBackIcon/>
            Back
        </button>
    )
}

export default BackArrow;