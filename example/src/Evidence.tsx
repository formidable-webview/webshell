import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph, Avatar } from 'react-native-paper';
import { TOP_TEXT_HEIGHT } from './styles';

const LeftContent = (props) => <Avatar.Icon {...props} icon="foot-print" />;
export const Evidence = ({
  webshellPosition
}: {
  webshellPosition: string;
}) => (
  <Card style={styles.card}>
    <Card.Title title="Evidence" left={LeftContent} />
    <Card.Content>
      <Paragraph>
        An evidence that the {webshellPosition} WebView height is automatic.
      </Paragraph>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { alignSelf: 'stretch', margin: 20, height: TOP_TEXT_HEIGHT - 40 }
});
