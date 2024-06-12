import { useRef } from 'react';
import Searchbar from "@/components/searchbar.jsx";
import { Box } from "@chakra-ui/react";

const SearchComponent = ({ onClose }) => {
    const ref = useRef(null);

    const handleOutsideClick = (event) => {
        if (!ref.current || !ref.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <Box position="fixed"
             top={0} right={0} bottom={0} left={0}
             bgColor="rgba(0, 0, 0, 0.5)"
             display="flex" justifyContent="center" alignItems="center"
             onClick={handleOutsideClick}
        >
            <Box ref={ref} className={"w-full p-10"}>
                <Searchbar onClose={onClose} />
            </Box>
        </Box>
    );
};

export default SearchComponent;