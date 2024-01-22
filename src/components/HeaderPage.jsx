import { Heading } from "@chakra-ui/react";

export default function HeaderPage({ pageName }) {
    return <Heading my={5} ml={5}>{pageName}</Heading>;
}