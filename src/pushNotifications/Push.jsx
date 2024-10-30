import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  GlobalStyles,
  CustomThemeProvider
} from '@a-little-world/little-world-design-system';
import React, { useState, useEffect } from "react";
import styled, { css, useTheme } from 'styled-components';

const PushDebugerContainer = styled.div`
  position: absolute;
  background: red;
  height: 200px;
  width: 600px;
  bottom: 0;
  left: 0;
`;

function InteralPushDebugger(){

    const theme = useTheme();
    return <><h1>Push Debugger</h1>
            <Button
              type="button"
              variation={ButtonVariations.Circle}
              appearance={ButtonAppearance.Primary}
              borderColor={theme.color.text.link}
              color={theme.color.text.link}
            >
                Request Push Permissions
            </Button>
            </>
}

export function CustomPushDebugger() {
    
    return <CustomPushDebuggerRoot >
        <PushDebugerContainer>
            <InteralPushDebugger/>
        </PushDebugerContainer>
    </CustomPushDebuggerRoot>
}

function CustomPushDebuggerRoot({ children }) {

  return (
      <CustomThemeProvider>
        <GlobalStyles />
        {children}
      </CustomThemeProvider>
  );
}
