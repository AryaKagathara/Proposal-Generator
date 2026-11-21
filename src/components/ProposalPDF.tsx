import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';

const isBrowser = typeof window !== 'undefined';
const getFontPath = (path: string) => isBrowser ? `${window.location.origin}${path}` : path;

Font.register({
  family: 'Homemade Apple',
  src: getFontPath('/fonts/HomemadeApple-Regular.ttf')
});

Font.register({
  family: 'Google Sans',
  fonts: [
    { src: getFontPath('/fonts/GoogleSans-Medium.ttf'), fontWeight: 'normal' },
    { src: getFontPath('/fonts/GoogleSans-Medium.ttf'), fontWeight: 'medium' },
    { src: getFontPath('/fonts/GoogleSans-Bold.ttf'), fontWeight: 'bold' }
  ]
});
Font.registerHyphenationCallback((word) => [word]);
import { ProposalState, getCurrencySymbol } from '@/hooks/useProposalState';
import { SERVICES_DATA } from '@/data/services';

const formatProposalDate = (dateStr?: string | Date) => {
  let date: Date;
  if (!dateStr) {
    date = new Date();
  } else if (dateStr instanceof Date) {
    date = dateStr;
  } else {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      date = new Date(dateStr);
    }
  }
  if (isNaN(date.getTime())) date = new Date();

  const day = date.getDate();
  const getOrdinalNum = (n: number) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  };
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `${getOrdinalNum(day)} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
};

const cleanText = (str: string | undefined | null) => {
  if (!str) return '';
  // Replace smart quotes and dashes to prevent Fontkit crashes
  let cleaned = str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...');

  // Strip standard emojis, pictograms, zero-width-joiners, and variation selectors (Helvetica safe)
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{200D}]/gu, '');

  return cleaned;
};

const wrapUrl = (str: string) => {
  if (!str) return '';
  return str.replace(/([\/._?=&+-])/g, '$1\u200B');
};

const renderCustomText = (text: string, styles: any) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <View key={idx} style={{ height: 10 }} />;

    if (trimmed.startsWith('# ')) {
      return <Text key={idx} style={[styles.subHeader, { marginTop: idx === 0 ? 0 : 15 }]}>{trimmed.substring(2)}</Text>;
    }
    if (trimmed.startsWith('## ')) {
      return <Text key={idx} style={[styles.subHeader, { fontSize: 14, marginTop: idx === 0 ? 0 : 10 }]}>{trimmed.substring(3)}</Text>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <View key={idx} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <View style={styles.listItemContent}>
            <Text style={styles.text}>{trimmed.substring(2)}</Text>
          </View>
        </View>
      );
    }
    return <Text key={idx} style={styles.text}>{trimmed}</Text>;
  });
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Google Sans',
    color: '#000000',
  },
  coverPage: {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    position: 'relative'
  },
  coverTopPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    width: '100%',
    objectFit: 'cover',
  },
  titlePrimary: { fontSize: 38, fontWeight: 'bold', marginBottom: 10, color: '#F35423' },
  titleSecondary: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#000000' },
  coverDetail: { fontSize: 11, color: '#000000', marginBottom: 4, lineHeight: 1.5 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#F35423', borderBottomWidth: 1.5, borderBottomColor: '#F35423', paddingBottom: 8 },
  section: { marginBottom: 20 },
  subHeader: { fontSize: 14, fontWeight: 'bold', color: '#000000', marginBottom: 8, marginTop: 12, lineHeight: 1.3 },
  text: { fontSize: 11, lineHeight: 1.6, color: '#000000', marginBottom: 8, textAlign: 'justify' },
  listItem: { flexDirection: 'row', marginBottom: 6 },
  bullet: { width: 15, fontSize: 11, color: '#F35423' },
  listItemContent: { flex: 1 },
  listItemTitle: { fontSize: 11, fontWeight: 'bold', color: '#000000', lineHeight: 1.4 },
  listItemDesc: { fontSize: 9.5, color: '#000000', marginTop: 2, lineHeight: 1.4 },
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableHeader: { backgroundColor: '#FEECE8' }, // Light peach tint for table headers
  tableColHalf: { width: '50%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  tableColThird: { width: '33.33%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  phaseColName: { width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  phaseColDuration: { width: '20%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  phaseColDeliverables: { width: '50%', padding: 8 },
  tableCellHeader: { fontSize: 9.5, fontWeight: 'bold', color: '#000000', lineHeight: 1.4 },
  tableCell: { fontSize: 9.5, lineHeight: 1.4, color: '#000000' },
  link: { fontSize: 9.5, color: '#F35423', textDecoration: 'none' },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: '#F35423',
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 8.5,
    color: '#F35423',
    fontWeight: 'bold',
  },
  footerRight: {
    fontSize: 8.5,
    color: '#000000',
  },
  signatureBox: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#000000', width: 250, paddingTop: 10 },
  logo: { width: 140, marginBottom: 30 },
  projectDetailsBox: { backgroundColor: '#F9FAFB', padding: 15, marginTop: 10, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#F35423' }
});

export const ProposalDocument = ({ state, origin = '' }: { state: ProposalState, origin?: string }) => {

  const totalBudget = parseFloat(state.totalPrice) || 0;
  // Use safe string codes (USD, INR) for the PDF instead of symbols (₹) to prevent Helvetica font crashes
  const currencySymbol = getCurrencySymbol(state.currency || 'USD', true);

  const renderFooter = () => {
    if (state.hideContactDetails) return null;
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerLeft}>Comsci Technologies LLP</Text>
        <Text style={styles.footerRight}>www.comsci.tech  |  hello@comsci.tech</Text>
      </View>
    );
  };

  return (
    <Document>
      {/* Page 1: Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        {/* Background Image placed at the very bottom */}
        <Image src={origin ? `${origin}/cover-pattern.png` : "/cover-pattern.png"} style={styles.coverTopPattern} />

        <View style={{ zIndex: 10 }}>
          <Text style={styles.titlePrimary}>{state.isPreliminaryQuote ? "Preliminary Quotation" : "Final Quotation"}</Text>
          <Text style={styles.titleSecondary}>{cleanText(state.clientName || '')}</Text>
        </View>

        <View style={{ zIndex: 10, paddingBottom: 300 }}>
          {/* Static Comsci Logo from Next.js public directory */}
          {!state.hideAboutAndLogo && (
            <Image src={origin ? `${origin}/comsci-logo.png` : "/comsci-logo.png"} style={{ width: 140, marginBottom: 15 }} />
          )}

          <Text style={[styles.coverDetail, { fontWeight: 'bold' }]}>Prepared by</Text>
          <Text style={[styles.coverDetail, { color: '#F35423', fontWeight: 'bold', fontSize: 16 }]}>Arya Kagathara</Text>
          {!state.hideContactDetails && (
            <Text style={styles.coverDetail}>CEO & Founder</Text>
          )}
          {!state.hideContactDetails && (
            <Text style={styles.coverDetail}>hello@comsci.tech | www.comsci.tech</Text>
          )}

          <Text style={[styles.coverDetail, { marginTop: 15 }]}>{formatProposalDate(state.projectDate || new Date())}</Text>
          <Text style={[styles.coverDetail, { fontSize: 9, color: '#6B7280' }]}>This proposal is valid for 14 days only.</Text>
        </View>
      </Page>

      {/* Page 2: Introduction & Project Details */}
      {!state.hideAboutAndLogo && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>About Comsci</Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              We are a multi-disciplinary Design and Development agency with a passion for creating impactful digital experiences.
              Our core focus is to deliver a modern, intuitive, and visually appealing outcomes that align with your brand identity and enhance user engagement.
            </Text>
            <Text style={styles.text}>
              Our process is built on collaboration, transparency, and a relentless pursuit of excellence. We don't just build websites or design logos; we craft comprehensive digital ecosystems that drive growth and establish a strong market presence.
            </Text>
          </View>
          <Text style={styles.header}>Our Mission</Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              Mission is to empower businesses through innovative technology and exceptional design. We strive to create digital solutions that not only look beautiful but also deliver measurable results. Our vision is to be the leading partner for digital transformation, helping our clients navigate the digital landscape with confidence and success.
            </Text>
          </View>

          <Image src={origin ? `${origin}/services-graphic.png` : "/services-graphic.png"} style={{ marginTop: 20, width: '100%', objectFit: 'contain' }} />

          {renderFooter()}
        </Page>
      )}

      {!state.hideAboutAndLogo && (
        <Page size="A4" style={styles.page}>
          <Image src={origin ? `${origin}/Team.jpg` : "/Team.jpg"} style={{ width: '100%', objectFit: 'contain' }} />
          {renderFooter()}
        </Page>
      )}

      {state.projectDetails && (
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.header}>Project Understanding & Requirements</Text>
            <Text style={styles.text}>
              The following outlines the project description and understanding.
            </Text>
            <View style={styles.projectDetailsBox} wrap={true}>
              {renderCustomText(cleanText(state.projectDetails), styles)}
            </View>
          </View>
          {renderFooter()}
        </Page>
      )}

      {/* Page 3: Scope of Work & Timelines */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Project Scope & Timelines</Text>
          <Text style={styles.text}>
            The following outlines the implementation phases, specific deliverables, and timelines included in this project.
          </Text>
        </View>

        {(!state.phases || state.phases.length === 0) && !state.customScopeContent ? (
          <Text style={styles.text}>No scope items or phases defined.</Text>
        ) : (
          <>
            {state.phases && state.phases.length > 0 && (() => {
              const showTimeline = !state.hideScopeTimeline;
              const colPhaseStyle = { width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' };
              const colDeliverablesStyle = {
                width: showTimeline ? '50%' : '70%',
                padding: 8,
                borderRightWidth: showTimeline ? 1 : 0,
                borderRightColor: '#E5E7EB'
              };
              const colDurationStyle = { width: '20%', padding: 8 };

              return (
                <View style={[styles.table, { marginTop: 10 }]}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={colPhaseStyle}><Text style={styles.tableCellHeader}>Phase</Text></View>
                    <View style={colDeliverablesStyle}><Text style={styles.tableCellHeader}>Scope / Deliverables</Text></View>
                    {showTimeline && (
                      <View style={colDurationStyle}><Text style={styles.tableCellHeader}>Timeline</Text></View>
                    )}
                  </View>
                  {state.phases.map((phase) => (
                    <View key={phase.id} style={styles.tableRow} wrap={false}>
                      <View style={colPhaseStyle}>
                        <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423' }]}>{cleanText(phase.name)}</Text>
                      </View>
                      <View style={colDeliverablesStyle}>
                        {phase.deliverables.map((del, dIdx) => (
                          <View key={del.id} style={{ marginBottom: dIdx === phase.deliverables.length - 1 ? 0 : 8 }}>
                            <Text style={[styles.tableCell, { color: '#1F2937' }]}>{cleanText(del.label)}</Text>
                            {del.description ? (
                              <Text style={[styles.tableCell, { color: '#4B5563', fontSize: 9, marginTop: 2, fontWeight: 'bold' }]}>
                                {cleanText(del.description)}
                              </Text>
                            ) : null}
                          </View>
                        ))}
                        {phase.deliverables.length === 0 && <Text style={[styles.tableCell, { color: '#9CA3AF' }]}>No deliverables listed.</Text>}
                      </View>
                      {showTimeline && (
                        <View style={colDurationStyle}>
                          <Text style={styles.tableCell}>{cleanText(phase.duration || '-')}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              );
            })()}
          </>
        )}

        {state.customScopeContent && (
          <View style={[styles.projectDetailsBox]} wrap={true}>
            {renderCustomText(cleanText(state.customScopeContent), styles)}
          </View>
        )}
        {renderFooter()}
      </Page>

      {/* Page 4: Project Budget & Milestones, Portfolio */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Financial Investment</Text>

        {(() => {
          const isHourly = state.pricingType === 'hourly';
          const hourlyRateNum = parseFloat(state.hourlyRate || '0');
          const estimatedHoursNum = parseFloat(state.estimatedHours || '0');
          const hasCalculatedHourlyTotal = !isNaN(hourlyRateNum) && !isNaN(estimatedHoursNum) && estimatedHoursNum > 0 && hourlyRateNum > 0;
          const hourlyEstimatedTotal = hasCalculatedHourlyTotal ? hourlyRateNum * estimatedHoursNum : 0;

          if (isHourly) {
            return (
              <>
                <Text style={[styles.subHeader]}>Hourly Engagement Model</Text>
                <View style={[styles.table, { marginTop: 5, marginBottom: 12 }]}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={state.estimatedHours ? { width: '40%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' } : { width: '50%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                      <Text style={styles.tableCellHeader}>Engagement Structure</Text>
                    </View>
                    <View style={state.estimatedHours ? { width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' } : { width: '50%', padding: 8 }}>
                      <Text style={styles.tableCellHeader}>Hourly Rate</Text>
                    </View>
                    {state.estimatedHours ? (
                      <View style={{ width: '30%', padding: 8 }}>
                        <Text style={styles.tableCellHeader}>Estimated Hours</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.tableRow} wrap={false}>
                    <View style={state.estimatedHours ? { width: '40%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' } : { width: '50%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                      <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423' }]}>Dedicated Hourly Work</Text>
                      <Text style={[styles.tableCell, { fontSize: 8.5, color: '#4B5563', marginTop: 2 }]}>
                        Time tracked accurately for all design, development, and revision activities.
                      </Text>
                    </View>
                    <View style={state.estimatedHours ? { width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' } : { width: '50%', padding: 8 }}>
                      <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 10 }]}>
                        {currencySymbol}{cleanText(state.hourlyRate || '0')} / hr
                      </Text>
                    </View>
                    {state.estimatedHours ? (
                      <View style={{ width: '30%', padding: 8 }}>
                        <Text style={[styles.tableCell, { fontSize: 10 }]}>{cleanText(state.estimatedHours)}</Text>
                      </View>
                    ) : null}
                  </View>

                  {hasCalculatedHourlyTotal && (
                    <View style={[styles.tableRow, { backgroundColor: '#FEECE8' }]} wrap={false}>
                      <View style={{ width: '70%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                        <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 11 }]}>Estimated Total Investment</Text>
                      </View>
                      <View style={{ width: '30%', padding: 8 }}>
                        <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 11 }]}>
                          {currencySymbol}{hourlyEstimatedTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            );
          }

          if (!state.hideMilestones) {
            return (
              <>
                <Text style={[styles.subHeader]}>Payment Milestones</Text>
                <View style={[styles.table, { marginTop: 5, marginBottom: 12 }]}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={styles.tableColThird}><Text style={styles.tableCellHeader}>Phase</Text></View>
                    <View style={styles.tableColThird}><Text style={styles.tableCellHeader}>Percentage</Text></View>
                    <View style={styles.tableColThird}><Text style={styles.tableCellHeader}>Amount ({getCurrencySymbol(state.currency || 'USD', true).trim()})</Text></View>
                  </View>
                  {state.paymentMilestones.map((ms) => {
                    const perc = parseFloat(ms.percentage) || 0;
                    const calcAmount = totalBudget * (perc / 100);
                    return (
                      <View key={ms.id} style={styles.tableRow} wrap={false}>
                        <View style={styles.tableColThird}><Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423' }]}>{cleanText(ms.name)}</Text></View>
                        <View style={styles.tableColThird}><Text style={styles.tableCell}>{ms.percentage}%</Text></View>
                        <View style={styles.tableColThird}><Text style={styles.tableCell}>{currencySymbol}{calcAmount.toFixed(2)}</Text></View>
                      </View>
                    );
                  })}
                  <View style={[styles.tableRow, { backgroundColor: '#FEECE8' }]} wrap={false}>
                    <View style={{ width: '66.66%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                      <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 12 }]}>Grand Total</Text>
                    </View>
                    <View style={{ width: '33.33%', padding: 8 }}>
                      <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 12 }]}>{currencySymbol}{totalBudget.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </>
            );
          }

          return (
            <>
              <Text style={[styles.subHeader]}>Project Quotation (Fixed Price)</Text>
              <View style={[styles.table, { marginTop: 5, marginBottom: 12 }]}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={{ width: '66.66%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                    <Text style={styles.tableCellHeader}>Scope / Deliverables</Text>
                  </View>
                  <View style={{ width: '33.33%', padding: 8 }}>
                    <Text style={styles.tableCellHeader}>Total Investment ({getCurrencySymbol(state.currency || 'USD', true).trim()})</Text>
                  </View>
                </View>
                <View style={styles.tableRow} wrap={false}>
                  <View style={{ width: '66.66%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                    <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423' }]}>Complete Project Scope & Deliverables</Text>
                    <Text style={[styles.tableCell, { fontSize: 8.5, color: '#4B5563', marginTop: 2 }]}>
                      Fixed-price investment covering all phases, design, development, and deliverables outlined in this proposal.
                    </Text>
                  </View>
                  <View style={{ width: '33.33%', padding: 8 }}>
                    <Text style={[styles.tableCell, { fontWeight: 'bold', fontSize: 11 }]}>{currencySymbol}{totalBudget.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={[styles.tableRow, { backgroundColor: '#FEECE8' }]} wrap={false}>
                  <View style={{ width: '66.66%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                    <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 12 }]}>Total Fixed Quote</Text>
                  </View>
                  <View style={{ width: '33.33%', padding: 8 }}>
                    <Text style={[styles.tableCell, { fontWeight: 'bold', color: '#F35423', fontSize: 12 }]}>{currencySymbol}{totalBudget.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </>
          );
        })()}

        {state.isPreliminaryQuote && (
          <View style={{ marginTop: 10, marginBottom: 5 }}>
            <Text style={[styles.text, { color: '#F35423', fontWeight: 'bold', fontSize: 9.5 }]}>
              Note: This Quote will be confirmed after a video meeting and complete briefing and then final quotation will be given.
            </Text>
          </View>
        )}

        <View style={{ marginTop: 10, marginBottom: 5 }}>
          <Text style={[styles.text, { color: '#F35423', fontWeight: 'bold', fontSize: 9.5 }]}>
            This proposal is valid for 14 days only.
          </Text>
        </View>

        <Text style={[styles.subHeader]}>Payment Mode</Text>
        <View style={styles.section}>
          <Text style={styles.text}>Bank to Bank, Payoneer, Wise, Dribbble, Behance, Upwork</Text>
          <Text style={styles.text}>Note: Whichever is the best for the client and us to get the money fast at lower exchange rates.</Text>
        </View>

        {renderFooter()}
      </Page>

      <Page size="A4" style={styles.page}>
        {(() => {
          let links = [...state.portfolioLinks];
          if (!state.hideContactDetails) {
            const hasWebsite = links.some(
              (l) => l.url && l.url.trim().toLowerCase().includes("comsci.tech")
            );
            if (!hasWebsite) {
              links.push({
                id: "default-comsci-website",
                name: "Our Website",
                url: "https://comsci.tech",
              });
            }
          }

          if (links.length === 0) return null;

          return (
            <>
              <Text style={styles.header}>Portfolio References</Text>
              <View style={[styles.table, { marginBottom: 20 }]}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={styles.tableColHalf}><Text style={styles.tableCellHeader}>Project Name</Text></View>
                  <View style={styles.tableColHalf}><Text style={styles.tableCellHeader}>Reference Link</Text></View>
                </View>
                {links.map((link, idx) => {
                  const url = link.url ? link.url.trim() : '';
                  const validUrl = (!url || url.startsWith('http')) ? url : `https://${url}`;
                  return (
                    <View key={idx} style={styles.tableRow} wrap={false}>
                      <View style={styles.tableColHalf}><Text style={styles.tableCell}>{cleanText(link.name)}</Text></View>
                      <View style={styles.tableColHalf}>
                        {validUrl ? (
                          <Link src={validUrl} style={styles.link}>{wrapUrl(cleanText(url))}</Link>
                        ) : (
                          <Text style={styles.tableCell}>{wrapUrl(cleanText(url)) || "-"}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          );
        })()}

        <Text style={styles.subHeader}>Tools We Use</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={styles.tableCellHeader}>Category</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCellHeader}>Tools / Frameworks / Databases</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Design</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>Figma, Adobe Illustrator, Adobe Photoshop, Affinity, Canva, Google Slides, Microsoft Office Suites </Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Frontend Web Dev</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>HTML, CSS, JS, ReactJS, NextJS, VueJS, Tailwind CSS</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Backend Web Dev</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>PHP WordPress-WooCommerce, Shopify, Laravel, Python Django, NodeJS, Express</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Databases</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>MySQL, MongoDB, PostgreSQL, Redis</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Video Meeting</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>Google Meet, Zoom, Microsoft Teams</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Project Management</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>Jira, Trello, ClickUp, Asana, Notion</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Communication</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>Email, Google Chat, Microsoft Teams</Text>
            </View>
          </View>

          <View style={styles.tableRow} wrap={false}>
            <View style={{ width: '30%', padding: 8, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Cloud & DevOps</Text>
            </View>
            <View style={{ width: '70%', padding: 8 }}>
              <Text style={styles.tableCell}>Hostinger, AWS, Google Cloud Platform (GCP), Vercel, Netlify, Docker, GitHub</Text>
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>

      {/* Page: Why Work With Us */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Key Services & Why Us</Text>
        <View style={{ gap: 10, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Custom Design: </Text>
              I do custom design only for you, every project is unique, and design should fit goals, not look like everyone else's.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Clear Timeline: </Text>
              Clear timeline and delivery dates, clear deadlines keep the project focused.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Quick Onboarding: </Text>
              Ready to start in 1-2 days, great ideas takes some time to get out of the box.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Fixed Pricing: </Text>
              Fixed pricing with milestone payments, we both want Transparency and not surprises.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Full File Ownership: </Text>
              Full ownership of [design, source, final, code, etc.] files, it belongs to you.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Regular Updates: </Text>
              Regular progress updates and meetings, the best results come from sharing ideas.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Step-by-Step Completion: </Text>
              Step-by-step project completion, great projects are built one step at a time.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }} wrap={false}>
            <View style={{ width: 5, height: 5, backgroundColor: '#F35423', marginTop: 5, marginRight: 10 }} />
            <Text style={[styles.text, { flex: 1, marginBottom: 0 }]}>
              <Text style={{ fontWeight: 'bold', color: '#F35423' }}>Long-Term Support: </Text>
              Long-term support whenever you need it, you shouldn't be left on your own after it completes.
            </Text>
          </View>
        </View>
        {renderFooter()}
      </Page>

      {/* Page 5: Terms & Approval */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Terms & Conditions</Text>
        <View style={styles.section}>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            1. Scope Timeline & Client Feedback: The project timeline is structured for within the estimated duration or earlier as well, assuming timely feedback within 24-48 hours. Delays in client feedback may extend the overall schedule. The timeline begins after the receipt of the initial payment and all required content/materials for the project from the client.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            2. Quality Assurance & Bug Fixes: All deliverables will go through a detailed testing and review process before launch. Any issues or bugs will be resolved at no additional cost.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            3. Content, Iconography & Visual Assets: If the client agrees to use royalty-free assets/design assets, I will assist in selecting content that best matches the brand’s tone and aesthetics. If the client prefers to use premium or paid icon/images/3D/Illustration/any other sets from third-party marketplaces, they may purchase and provide them.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            4. Third-Party Services & Costs: Any recurring expenses such as server hosting, domain renewals, premium plugins, or third-party API services will be borne by the client. I will assist in setup and configuration to help optimize the client's costs.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            5. Post-Launch Support & Future Collaboration: I will continue to support and maintain the project post-deployment. I'm open to assisting with future updates, feature expansions, or design refreshes as part of a long-term collaboration.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            6. Additional Features & Future Scope: Any additional features, complex functionalities, or requirements not mentioned/included in the current project scope will be treated as part of a future phase or as a project extension. Such updates will be planned, estimated, and executed separately. I is happy to accommodate reasonable adjustments along the way while ensuring the core project stays on track.
          </Text>
          <Text style={[styles.text, { fontSize: '10.5px', marginBottom: 6 }]}>
            7. Termination Policy: Immediate termination if client's misconduct, negligence, contract breach, or harmful/abusive behavior. Either party may terminate with notice. If terminated by the client, all work done and completed milestones must be paid, and the advance payment remains non-refundable. Handover of project files and return of client materials is subject to full settlement of all outstanding fees. Developer retains ownership of all intellectual property, designs, and source code until final payment is settled in full.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.header, { borderBottomWidth: 0, paddingBottom: 0, fontSize: 15, marginBottom: 10 }]}>Authority Signature</Text>
          <Image src={origin ? `${origin}/Signature.jpg` : "/Signature.jpg"} style={{ width: 140, height: 45, objectFit: 'contain', marginBottom: 5 }} />
          <View>
            <Text style={[styles.text, { fontWeight: 'bold', color: '#000000', fontSize: 9, marginBottom: 2 }]}>Unique Encrypted Digital Signature</Text>
            <Text style={{ fontSize: 6, color: '#000000', marginBottom: 4 }}>
              {("SIGNED-0f434ae6eb545f612a672c945cf217c6eaebe00c1aa5e3ecf2e969df14f10429db953d0f8c2ab8d5b384edd2b71dc15f61fea0feb4d247184e86b752506fc6317c89d7b503ae1dc822d4ef2f1230df0e7c7effae26945ac88ff69d4cc9a3d05ac88ed54a6cc22647e0ea769c6d8574bcde745bf6c0afe6a006967d31f592ecdt".match(/.{1,60}/g) || []).join('\n')}
              {(() => {
                const now = new Date();
                let date = now;
                if (state.projectDate) {
                  const parts = state.projectDate.split('-');
                  if (parts.length === 3) {
                    date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), now.getHours(), now.getMinutes());
                  }
                }
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear());
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                return `${day}${month}${year}${hours}${minutes}`;
              })()}IST
            </Text>
          </View>
        </View>
        {renderFooter()}
      </Page>
    </Document >
  );
};
