
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackArrow(props) {
    return (
        <button className='back-arrow' onClick={props.onClick} style={{...props.style}}>
            <div className='back-arrow-inner'>
                <ArrowBackIcon/>
                Back
            </div>
        </button>
    )
}

export default BackArrow;