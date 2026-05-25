"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Product } from '@/types';

// Opcional: Registrar fonte customizada para ficar brutalista (Mono/Sans pesada)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    fontFamily: 'Helvetica', // Fallback standard
  },
  coverPage: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  coverTitle: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'black',
    letterSpacing: 10,
    textTransform: 'uppercase',
  },
  coverSubtitle: {
    color: '#888888',
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  productPage: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    border: '8 solid #000000', // Bordas massivas
  },
  imageContainer: {
    height: '65%',
    width: '100%',
    borderBottom: '4 solid #000000',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsContainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '2 solid #000000',
    paddingBottom: 15,
  },
  titleBlock: {
    flex: 0.7,
  },
  category: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#666666',
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  priceBlock: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  specItem: {
    width: '50%',
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#888888',
    marginBottom: 3,
  },
  specValue: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '2 solid #000000',
    paddingTop: 10,
    marginTop: 20,
  },
  footerText: {
    fontSize: 7,
    letterSpacing: 2,
    color: '#000000',
    textTransform: 'uppercase',
  }
});

interface LookbookPDFProps {
  products: Product[];
}

export const LookbookPDF = ({ products }: LookbookPDFProps) => (
  <Document>
    {/* CAPA */}
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>HOOKE</Text>
      <Text style={styles.coverSubtitle}>Elite Lookbook Vol. 1</Text>
    </Page>

    {/* PÁGINAS DOS PRODUTOS */}
    {products.map((p, idx) => {
      // Formatação do preço de varejo
      const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price || 0);

      return (
        <Page key={p.id} size="A4" style={styles.productPage}>
          <View style={styles.imageContainer}>
            {/* O react-pdf/renderer pode falhar com URLs webp/avif, idealmente usar JPG/PNG. 
                Aqui passamos a URL direta, Cloudinary converte se necessário, mas para PDF é bom garantir compatibilidade */}
            <Image 
              src={p.imageUrl || '/placeholder.jpg'} 
              style={styles.image} 
            />
          </View>
          <View style={styles.detailsContainer}>
            
            <View style={styles.headerRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.category}>{p.category || 'GEOMETRIA'}</Text>
                <Text style={styles.name}>{p.name}</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>{priceFormatted}</Text>
              </View>
            </View>

            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>COMPOSIÇÃO</Text>
                <Text style={styles.specValue}>{p.details?.fabric || 'ALGODÃO PREMIUM HEAVYWEIGHT 260G'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>MODELAGEM</Text>
                <Text style={styles.specValue}>{p.details?.model || 'EDITORIAL BOXY ESTRUTURADO'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>SKU</Text>
                <Text style={styles.specValue}>{p.id}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>DISPONIBILIDADE</Text>
                <Text style={styles.specValue}>ENVIO IMEDIATO</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>WWW.USEHOOKE.COM.BR</Text>
              <Text style={styles.footerText}>PÁG {idx + 2}</Text>
            </View>

          </View>
        </Page>
      );
    })}
  </Document>
);
