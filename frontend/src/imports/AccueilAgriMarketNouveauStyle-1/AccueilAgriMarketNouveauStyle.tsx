import svgPaths from "./svg-xmpaao6rjn";
import imgFreshTomatoes from "./f11d2f217736421a4ccf6a7914ad2a95cadb9b8d.png";
import imgTomatesCoeurDeBoeuf from "./28abaadf48dc26e35e09d8562d9d8e8ff20fac8b.png";
import imgCarottesBio from "./01bec6ae2d6fffe373c07a1529c48ed39eb17ffd.png";
import imgSaladeFraiche from "./3d6257e9ca5a1db8ae5db66920735b5e0600a84f.png";
import imgAilViolet from "./e6d1e9cdf8d1aa3da1a05c8f80482cf1ed0c3ff2.png";

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#7fb8ac] text-[16px] w-full">
        <p className="leading-[normal]">Rechercher des produits frais...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[48px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[48px] pr-[16px] py-[18px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #498176)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bottom-0 content-stretch flex items-center left-[16px] top-0" data-name="Container">
      <Container2 />
    </div>
  );
}

function SearchBarSection() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Search Bar Section">
      <Input />
      <Container1 />
    </div>
  );
}

function FreshTomatoes() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Fresh tomatoes">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgFreshTomatoes} />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative size-[224px]" data-name="Container">
      <FreshTomatoes />
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.2)] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[96.97px]">
        <p className="leading-[15px]">Offre Spéciale</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Extra_Bold',sans-serif] h-[113px] justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-white w-[140.89px]">
        <p className="leading-[37.5px] mb-0">-30% sur</p>
        <p className="leading-[37.5px] mb-0">les</p>
        <p className="leading-[37.5px] text-[#ffc3c0]">Tomates</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start pt-px relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffefee] text-[14px] w-[163.16px]">
        <p className="leading-[20px] mb-0">Récoltées ce matin dans</p>
        <p className="leading-[20px]">nos serres locales.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start max-w-[205.1999969482422px] relative shrink-0" data-name="Container">
      <OverlayOverlayBlur />
      <Heading />
      <Container5 />
    </div>
  );
}

function SectionPromoBanner() {
  return (
    <div className="h-[192px] relative rounded-[48px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(150.69deg, rgb(152, 61, 73) 0%, rgb(153, 32, 39) 100%)" }} data-name="Section - Promo Banner">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center p-[32px] relative size-full">
          <div className="absolute bottom-[-40.84px] flex items-center justify-center right-[-40.84px] size-[265.677px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
            <div className="flex-none rotate-12">
              <Container3 />
            </div>
          </div>
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[20px] tracking-[-0.5px] w-[103.2px]">
        <p className="leading-[28px]">Catégories</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#006851] text-[14px] text-center w-[57.5px]">
        <p className="leading-[20px]">Voir tout</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Button />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[21.281px] relative shrink-0 w-[21.304px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.3036 21.2809">
        <g id="Container">
          <path d={svgPaths.p288d9d00} fill="var(--fill-0, #006851)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#a4f1e1] content-stretch flex items-center justify-center py-[38px] relative rounded-[48px] shrink-0 w-full" data-name="Background">
      <Container8 />
    </div>
  );
}

function Legumes() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[11.5px] items-center left-[24px] top-0 w-[112px]" data-name="Légumes">
      <Background />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#2c655b] text-[14px] text-center w-[62.11px]">
        <p className="leading-[20px]">Légumes</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[23.771px] relative shrink-0 w-[17.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 23.7708">
        <g id="Container">
          <path d={svgPaths.p556fc00} fill="var(--fill-0, #006851)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#a4f1e1] content-stretch flex items-center justify-center py-[38px] relative rounded-[48px] shrink-0 w-full" data-name="Background">
      <Container9 />
    </div>
  );
}

function Fruits() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[11.5px] items-center left-[152px] top-0 w-[112px]" data-name="Fruits">
      <Background1 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#2c655b] text-[14px] text-center w-[38.23px]">
        <p className="leading-[20px]">Fruits</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[22.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 22.5">
        <g id="Container">
          <path d={svgPaths.p16966e80} fill="var(--fill-0, #006851)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#a4f1e1] content-stretch flex items-center justify-center py-[38px] relative rounded-[48px] shrink-0 w-full" data-name="Background">
      <Container10 />
    </div>
  );
}

function Herbes() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[11.5px] items-center left-[280px] top-0 w-[112px]" data-name="Herbes">
      <Background2 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#2c655b] text-[14px] text-center w-[49.2px]">
        <p className="leading-[20px]">Herbes</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[25px] relative shrink-0 w-[22.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 25">
        <g id="Container">
          <path d={svgPaths.p1a47da00} fill="var(--fill-0, #006851)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#a4f1e1] content-stretch flex items-center justify-center py-[38px] relative rounded-[48px] shrink-0 w-full" data-name="Background">
      <Container11 />
    </div>
  );
}

function Bio() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[11.5px] items-center left-[408px] top-0 w-[112px]" data-name="Bio">
      <Background3 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#2c655b] text-[14px] text-center w-[21.42px]">
        <p className="leading-[20px]">Bio</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[144px] overflow-clip relative shrink-0 w-[390px]" data-name="Container">
      <Legumes />
      <Fruits />
      <Herbes />
      <Bio />
    </div>
  );
}

function CategoriesSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center pt-[8px] relative shrink-0 w-full" data-name="Categories Section">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[20px] tracking-[-0.5px] w-[179px]">
        <p className="leading-[28px]">Produits Populaires</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(0,104,81,0.1)] content-stretch flex flex-col items-start px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#006851] text-[12px] tracking-[1.2px] uppercase w-[41.11px]">
        <p className="leading-[16px]">Frais</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Overlay />
    </div>
  );
}

function TomatesCoeurDeBoeuf() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="Tomates Cœur de Bœuf">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgTomatesCoeurDeBoeuf} />
      </div>
    </div>
  );
}

function OverlayOverlayBlur1() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.4)] content-stretch flex flex-col items-start left-[8px] px-[8px] py-[2px] rounded-[9999px] top-[8px]" data-name="Overlay+OverlayBlur">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#006851] text-[10px] w-[25.38px]">
        <p className="leading-[15px]">-15%</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="absolute aspect-square bg-[#aff6e7] content-stretch flex flex-col items-start justify-center left-[13px] overflow-clip right-[13px] rounded-[32px] top-[13px]" data-name="Background">
      <TomatesCoeurDeBoeuf />
      <OverlayOverlayBlur1 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[13px] overflow-clip right-[13px] top-[162px]" data-name="Heading 4">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[14px] w-[133.5px]">
        <p className="leading-[20px]">Tomates Cœur de …</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.8px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] left-0 not-italic text-[#006851] text-[16px] top-[12px] w-[54.8px]">
        <p className="leading-[24px]">{`4,50 € `}</p>
      </div>
      <div className="absolute h-[9.775px] left-[55.02px] top-[10.02px] w-[14.004px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0039 9.77539">
          <path d={svgPaths.p347f000} fill="var(--fill-0, #7FB8AC)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#006851] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Button">
      <Container15 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[13px] right-[13px] top-[186px]" data-name="Container">
      <Paragraph />
      <Button1 />
    </div>
  );
}

function Product() {
  return (
    <div className="bg-white col-1 h-[231px] justify-self-stretch relative rounded-[32px] row-1 shrink-0" data-name="Product 1">
      <div aria-hidden="true" className="absolute border border-[rgba(73,129,118,0.05)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_12px_32px_0px_rgba(0,104,81,0.04)]" />
      <Background4 />
      <Heading3 />
      <Container14 />
    </div>
  );
}

function CarottesBio() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="Carottes Bio">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCarottesBio} />
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="absolute aspect-square bg-[#aff6e7] content-stretch flex flex-col items-start justify-center left-[13px] overflow-clip right-[13px] rounded-[32px] top-[13px]" data-name="Background">
      <CarottesBio />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[13px] overflow-clip right-[13px] top-[162px]" data-name="Heading 4">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[14px] w-[85.13px]">
        <p className="leading-[20px]">Carottes Bio</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.94px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] left-0 not-italic text-[#006851] text-[16px] top-[12px] w-[54.94px]">
        <p className="leading-[24px]">{`2,90 € `}</p>
      </div>
      <div className="absolute h-[9.775px] left-[55.16px] top-[10.02px] w-[14.004px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0039 9.77539">
          <path d={svgPaths.p347f000} fill="var(--fill-0, #7FB8AC)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#006851] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Button">
      <Container17 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[13px] right-[13px] top-[186px]" data-name="Container">
      <Paragraph1 />
      <Button2 />
    </div>
  );
}

function Product1() {
  return (
    <div className="bg-white col-2 h-[231px] justify-self-stretch relative rounded-[32px] row-1 shrink-0" data-name="Product 2">
      <div aria-hidden="true" className="absolute border border-[rgba(73,129,118,0.05)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_12px_32px_0px_rgba(0,104,81,0.04)]" />
      <Background5 />
      <Heading4 />
      <Container16 />
    </div>
  );
}

function SaladeFraiche() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="Salade Fraîche">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSaladeFraiche} />
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div className="absolute aspect-square bg-[#aff6e7] content-stretch flex flex-col items-start justify-center left-[13px] overflow-clip right-[13px] rounded-[32px] top-[13px]" data-name="Background">
      <SaladeFraiche />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[13px] overflow-clip right-[13px] top-[162px]" data-name="Heading 4">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[14px] w-[100.19px]">
        <p className="leading-[20px]">Salade Batavia</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] leading-[0] not-italic relative shrink-0 w-[61.06px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center left-0 text-[#006851] text-[16px] top-[12px] w-[51.53px]">
        <p className="leading-[24px]">{`1,80 € `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center left-[51.53px] text-[#7fb8ac] text-[10px] top-[14px] w-[9.53px]">
        <p className="leading-[15px]">/u</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#006851] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Button">
      <Container19 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[13px] right-[13px] top-[186px]" data-name="Container">
      <Paragraph2 />
      <Button3 />
    </div>
  );
}

function Product2() {
  return (
    <div className="bg-white col-1 h-[231px] justify-self-stretch relative rounded-[32px] row-2 shrink-0" data-name="Product 3">
      <div aria-hidden="true" className="absolute border border-[rgba(73,129,118,0.05)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_12px_32px_0px_rgba(0,104,81,0.04)]" />
      <Background6 />
      <Heading5 />
      <Container18 />
    </div>
  );
}

function AilViolet() {
  return (
    <div className="h-[137px] relative shrink-0 w-full" data-name="Ail Violet">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAilViolet} />
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="absolute aspect-square bg-[#aff6e7] content-stretch flex flex-col items-start justify-center left-[13px] overflow-clip right-[13px] rounded-[32px] top-[13px]" data-name="Background">
      <AilViolet />
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[13px] overflow-clip right-[13px] top-[162px]" data-name="Heading 4">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#00362e] text-[14px] w-[131.03px]">
        <p className="leading-[20px]">Ail Violet de Cado…</p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.66px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] left-0 not-italic text-[#006851] text-[16px] top-[12px] w-[54.66px]">
        <p className="leading-[24px]">{`6,20 € `}</p>
      </div>
      <div className="absolute h-[9.775px] left-[54.88px] top-[10.02px] w-[14.004px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0039 9.77539">
          <path d={svgPaths.p347f000} fill="var(--fill-0, #7FB8AC)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p38ac19c0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#006851] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Button">
      <Container21 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[13px] right-[13px] top-[186px]" data-name="Container">
      <Paragraph3 />
      <Button4 />
    </div>
  );
}

function Product3() {
  return (
    <div className="bg-white col-2 h-[231px] justify-self-stretch relative rounded-[32px] row-2 shrink-0" data-name="Product 4">
      <div aria-hidden="true" className="absolute border border-[rgba(73,129,118,0.05)] border-solid inset-0 pointer-events-none rounded-[32px] shadow-[0px_12px_32px_0px_rgba(0,104,81,0.04)]" />
      <Background7 />
      <Heading6 />
      <Container20 />
    </div>
  );
}

function Container13() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__231px_231px] relative shrink-0 w-full" data-name="Container">
      <Product />
      <Product1 />
      <Product2 />
      <Product3 />
    </div>
  );
}

function PopularProductsSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start pt-[8px] relative shrink-0 w-full" data-name="Popular Products Section">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[672px] relative shrink-0 w-full" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] pb-[176px] pt-[96px] px-[24px] relative size-full">
        <SearchBarSection />
        <SectionPromoBanner />
        <CategoriesSection />
        <PopularProductsSection />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2bce57c0} fill="var(--fill-0, #065F46)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative shrink-0" data-name="Button">
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#064e3b] text-[24px] tracking-[-0.6px] w-[212.81px]">
        <p className="leading-[32px]">Digital Greenhouse</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Button5 />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #065F46)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative shrink-0" data-name="Button">
      <Container25 />
    </div>
  );
}

function NavTopAppBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(236,253,245,0.7)] content-stretch flex items-center justify-between left-0 px-[24px] py-[16px] shadow-[0px_12px_32px_0px_rgba(0,104,81,0.08)] top-0 w-[390px]" data-name="Nav - TopAppBar">
      <Container22 />
      <Button6 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[18px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 18">
        <g id="Container">
          <path d={svgPaths.p12a32500} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[34.42px]">
        <p className="leading-[15px]">Home</p>
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#059669] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_#a7f3d0,0px_4px_6px_-4px_#a7f3d0]" data-name="Overlay+Shadow" />
      <Container26 />
      <Margin />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #065F46)" fillOpacity="0.5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(6,95,70,0.5)] tracking-[1px] uppercase w-[47.19px]">
        <p className="leading-[15px]">Search</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative shrink-0" data-name="Container">
      <Container28 />
      <Margin1 />
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.982px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9815 20">
        <g id="Container">
          <path d={svgPaths.pb5c2400} fill="var(--fill-0, #065F46)" fillOpacity="0.5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(6,95,70,0.5)] tracking-[1px] uppercase w-[31.53px]">
        <p className="leading-[15px]">Cart</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative shrink-0" data-name="Container">
      <Container30 />
      <Margin2 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[18.35px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18.35">
        <g id="Container">
          <path d={svgPaths.p279a9400} fill="var(--fill-0, #065F46)" fillOpacity="0.5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(6,95,70,0.5)] tracking-[1px] uppercase w-[63.53px]">
        <p className="leading-[15px]">Favorites</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative shrink-0" data-name="Container">
      <Container32 />
      <Margin3 />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #065F46)" fillOpacity="0.5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-[rgba(6,95,70,0.5)] tracking-[1px] uppercase w-[48.02px]">
        <p className="leading-[15px]">Profile</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[12px] relative shrink-0" data-name="Container">
      <Container34 />
      <Margin4 />
    </div>
  );
}

function BottomNavBar() {
  return (
    <div className="absolute backdrop-blur-[20px] bg-[rgba(236,253,245,0.8)] bottom-0 content-stretch flex gap-[2.7px] items-center left-0 pb-[24px] pl-[17.33px] pr-[17.35px] pt-[12px] rounded-tl-[48px] rounded-tr-[48px] shadow-[0px_-8px_24px_0px_rgba(0,104,81,0.06)] w-[390px]" data-name="BottomNavBar">
      <Background8 />
      <Container27 />
      <Container29 />
      <Container31 />
      <Container33 />
    </div>
  );
}

export default function AccueilAgriMarketNouveauStyle() {
  return (
    <div className="bg-[#d6fff5] content-stretch flex flex-col items-start pb-[4px] relative size-full" data-name="Accueil AgriMarket - Nouveau Style">
      <Main />
      <NavTopAppBar />
      <BottomNavBar />
    </div>
  );
}