import { AreaProvider } from './personal-os/theme/area-provider'
import { Heading, Text, Flex } from '@radix-ui/themes'

export default function App() {
  return (
    <AreaProvider area="home">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Heading className="pos-display">Home <em>dashboard</em></Heading>
        <Text color="gray" size="2" mt="2">Design system active ✓</Text>
      </Flex>
    </AreaProvider>
  )
}
