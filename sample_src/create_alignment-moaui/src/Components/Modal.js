import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AlignHelpImage from '../svg/AlignHelp.svg'
import SegmHelpImage from '../svg/SegmHelp.svg'

export {AlignHelp, SegmHelp}

function AlignHelp(openModal, closeModal) {
  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        width: 756*0.75,
        height: 213*0.75,
        border: '0px solid #000',
        borderRadius: '5px',
        boxShadow: 24,
      }}>
        <img className="imageStyle" src={AlignHelpImage} alt="" />
      </Box>
    </Modal>
  )
}

function SegmHelp(openModal, closeModal) {
  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        width: 655*0.8,
        height: 213*0.8,
        border: '0px solid #000',
        borderRadius: '5px',
        boxShadow: 24,
      }}>
        <img className="imageStyle" src={SegmHelpImage} alt="" />
      </Box>
    </Modal>
  )
}