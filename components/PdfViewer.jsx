'use client'
import React from 'react'
import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react'
const PdfViewer = ({url}) => {

    const customLang = 'pt_PT'
    const localization = {
    [customLang]: {
      // Import the English localization as a fallback
    //   ...Locales.en_US,
      firstPageLabel: 'Ir para a primeira página',
      lastPageLabel: 'Última página'
    }
  }
  return (
    <RPConfig localization={localization}>
      <RPProvider
       src={url ||"https://cdn.codewithmosh.com/image/upload/v1721763853/guides/web-roadmap.pdf"}>
           
        <RPDefaultLayout style={{ height: '660px' }}>
          <RPPages />
        </RPDefaultLayout>
      </RPProvider>
    </RPConfig>
  )
}

export default PdfViewer
