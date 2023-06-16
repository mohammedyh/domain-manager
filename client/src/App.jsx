import { UserButton } from "@clerk/clerk-react";
import {
  Badge,
  Button,
  Card,
  Flex,
  Icon,
  Metric,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from "@tremor/react";
import { Box, Clock4, Pencil, ShieldAlert, Trash } from "lucide-react";
import {Link} from 'react-router-dom'

function App() {
  return (
    <main className="p-8">
      <Flex justifyContent="between">
        <Title>Dashboard</Title>
        <div className="flex items-center">
          <Button color="indigo" className="mr-10">
            <Link to="/domains/new">Add Domain</Link>
          </Button>
          <UserButton afterSignOutUrl="/signin" />
        </div>
      </Flex>

      <Flex className="gap-6 mt-10">
        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={Box} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Total Domains</Text>
              <Metric className="mt-2">2</Metric>
            </div>
          </Flex>
        </Card>

        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={Clock4} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Domains Expiring This Month</Text>
              <Metric className="mt-2">2</Metric>
            </div>
          </Flex>
        </Card>

        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={ShieldAlert} variant="light" size="xl" color="indigo" />
            <div>
              <Text>Domains SSL Expiring This Month</Text>
              <Metric className="mt-2">2</Metric>
            </div>
          </Flex>
        </Card>
      </Flex>

      {/* Main section */}
      <Card className="h-full mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Domain</TableHeaderCell>
              <TableHeaderCell>Expires On</TableHeaderCell>
              <TableHeaderCell>Registered On</TableHeaderCell>
              <TableHeaderCell>Updated On</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Registrar</TableHeaderCell>
              <TableHeaderCell>DNS / SSL Info</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>mohammedcodes.dev</TableCell>
              <TableCell>05/04/2024</TableCell>
              <TableCell>05/04/2023</TableCell>
              <TableCell>12/04/2023</TableCell>
              <TableCell>
                <Badge color="green" size="xs">
                  <span className="font-medium">Active</span>
                </Badge>
              </TableCell>
              <TableCell>Namecheap</TableCell>
              <TableCell>
                <Button size="xs" variant="primary" color="indigo">
                  See details
                </Button>
              </TableCell>
              <TableCell>
                <Flex justifyContent="end" className="space-x-2">
                  <button>
                    <Icon
                      icon={Pencil}
                      variant="light"
                      size="md"
                      color="indigo"
                    />
                  </button>
                  <button>
                    <Icon icon={Trash} variant="light" size="md" color="red" />
                  </button>
                </Flex>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

export default App;
