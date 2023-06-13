import { UserButton } from "@clerk/clerk-react";
import { Card, Col, Flex, Grid, Title } from "@tremor/react";

function App() {
  return (
    <main className="p-8">
      <Flex justifyContent="between">
        <Title>Dashboard Overview</Title>
        <UserButton />
      </Flex>

      <Grid numItemsLg={6} className="gap-6 mt-6">
        {/* Main section */}
        <Col numColSpanLg={4}>
          <Card className="h-full">
            <div className="h-60" />
          </Card>
        </Col>

        {/* KPI sidebar */}
        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <div className="h-24" />
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
            <Card>
              <div className="h-24" />
            </Card>
          </div>
        </Col>
      </Grid>
    </main>
  );
}

export default App;
