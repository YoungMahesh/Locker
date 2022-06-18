import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import { TokenTypes1 } from "../../backend/utils"

export default function TokenTypeSelector({
  tokenType,
  setTokenType,
}: {
  tokenType: TokenTypes1
  setTokenType: (_: TokenTypes1) => void
}) {
  return (
    <FormControl component="fieldset">
  
      <RadioGroup
        row
        aria-label="gender"
        name="row-radio-buttons-group"
        value={tokenType}
        onChange={(e) => setTokenType(e.target.value as TokenTypes1)}
      >
        <FormControlLabel value="ETH" control={<Radio />} label="ETH" />

        <FormControlLabel value="ERC20" control={<Radio />} label="ERC20" />
        <FormControlLabel value="ERC721" control={<Radio />} label="ERC721" />
        <FormControlLabel value="ERC1155" control={<Radio />} label="ERC1155" />
      </RadioGroup>
    </FormControl>
  )
}
