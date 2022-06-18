import Button from '@mui/material/Button'

const getColor = (_colorType: 'pink' | 'gray' | 'black') => {
  if (_colorType === 'pink')
    return 'linear-gradient(180deg, #FD57CE 0%, #E928AE 100%)'
  if (_colorType === 'gray') return 'rgba(255, 255, 255, 0.15)'
  return 'black'
}
export default function Button1({
  title,
  onClick,
  sizeType,
  colorType,
  style,
}: {
  title: any
  onClick: (val?: any) => void
  sizeType: 1 | 2
  colorType: 'pink' | 'gray' | 'black'
  style?: any
}) {
  return (
    <Button
      sx={{
        fontWeight: '600',
        borderRadius: '5px',
        border: colorType === 'black' ? '1px solid white' : 'none',
        padding: sizeType === 1 ? '7px 25px' : '15px 25px',
        textTransform: 'none',
        margin: '10px',
        maxWidth: 'max-content',
        ...style,
      }}
      variant="contained"
      onClick={onClick}
    >
      {title}
    </Button>
  )
}
