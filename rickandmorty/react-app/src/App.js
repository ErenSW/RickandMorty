import './App.css'; // Uygulama için CSS dosyasını içe aktar

import React, { useState, useEffect } from 'react'; // React ve gerekli hooks'ları içe aktar
import CharacterDetails from './characterdetails/CharacterDetails'; // CharacterDetails bileşenini içe aktar
import { BrowserRouter as Router, Route, Routes, Link, useParams, Navigate } from 'react-router-dom'; // React Router bileşenlerini içe aktar

function App() {
  // Gerekli state'leri tanımla
  const [cardsData, setCardsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sayfa yüklendiğinde ve currentPage veya searchQuery değiştiğinde veri al
  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  // API'den karakter verilerini al ve state'leri güncelle
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/characters'); // Karakter verilerini almak için API'ye istek gönder
      const data = await response.json(); // JSON formatındaki veriyi al
      const charactersPerPage = 6; // Sayfa başına gösterilecek karakter sayısı
      const startIndex = (currentPage - 1) * charactersPerPage; // Başlangıç dizini
      const endIndex = currentPage * charactersPerPage; // Bitiş dizini
      const filteredCharacters = data.characters.filter(character =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      ); // Arama sorgusuna göre karakterleri filtrele
      const characters = filteredCharacters.slice(startIndex, endIndex); // Sayfada gösterilecek karakterleri al
      setTotalPages(Math.ceil(filteredCharacters.length / charactersPerPage)); // Toplam sayfa sayısını belirle
      setCardsData(characters); // Karakter verilerini güncelle
    } catch (error) {
      console.error('Veri çekme hatası:', error); // Hata durumunda konsola hata mesajını yazdır
    }
  };

  // Sayfayı değiştir
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Geçerli sayfa numarasını güncelle
    }
  };

  // Arama sorgusunu güncelle ve sayfayı sıfırla
  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Arama sorgusunu güncelle
    setCurrentPage(1); // Sayfayı sıfırla
  };

  // Sayfa alt kısmı bileşeni
  function Footer({ currentPage, totalPages, goToPage }) {
    return (
      <div className="footer">
        <div className="pagination" id="pagination">
          {/* Önceki sayfa butonu */}
          <a href="javascript:void(0);" className="prev" onClick={() => goToPage(currentPage - 1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </a>
          {/* Sayfa numaraları */}
          {Array.from({ length: totalPages }, (_, index) => {
            if (
              (currentPage === 1 && index <= currentPage + 2) ||
              (currentPage === totalPages && index >= currentPage - 4) ||
              (index === currentPage - 2 || index === currentPage - 1 || index === currentPage || index === currentPage + 1)
            ) {
              return (
                <a
                  key={index}
                  href="javascript:void(0);"
                  style={index + 1 === currentPage ? { color: "orange" } : {}}
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </a>
              );
            } else if (currentPage === totalPages - 1 && index === totalPages - 4) {
              return (
                <a
                  key={index}
                  href="javascript:void(0);"
                  onClick={() => goToPage(totalPages - 3)}
                >
                  {totalPages - 3}
                </a>
              );
            }
            return null;
          })}
          {/* Sonraki sayfa butonu */}
          <a href="javascript:void(0);" className="next" onClick={() => goToPage(currentPage + 1)}>
            <i className="fa-solid fa-chevron-right"></i>
          </a>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        {/* Arama çubuğu */}
        <div className="search-main">
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search" 
              value={searchQuery} 
              onChange={handleSearch}
            />
            <button className="btn-search custom-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        {/* Sayfa yönlendirme */}
        <Routes>
          {/* Karakter detayları sayfası */}
          <Route
            path="/characterdetails/:id"
            element={<CharacterDetails characters={cardsData} />}
          />
          
          {/* Ana sayfa */}
          <Route
            path="/"
            element={
              <div>
                <div className="content">
                  {/* Karakter kartları */}
                  <div className="character-container">
                    {cardsData.map((character) => (
                      <Card
                        key={character.id}
                        id={character.id}
                        name={character.name}
                        status={character.status}
                        species={character.species}
                        lastKnownLocation={character.location}
                        image={character.image}
                        firstSeen={character.firstSeenLocation}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Sayfa alt kısmı */}
                <Footer currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Karakter kart bileşeni
function Card({ id, name, status, species, lastKnownLocation, image, firstSeen }) {
  console.log(id); // Konsola karakter ID'sini yazdır
  return (
    <div className="ch-box">
      <div className='ch-Image'>
        <img src={image} alt="" />
      </div>
      <div className='ch-Content'>
        {/* Karakter adına tıklandığında sadece adı ve kimlik numarasını göstermek için onClick olayı ekleyin */}
        <a href={`/characterdetails/${id}`} target="_blank" rel="noopener noreferrer">
          <h2>{name}</h2>
        </a>
        <span className='ch-Status'>
          {/* Karakter durumu ve türü */}
          {status === 'Alive' && <span className='ch-Icon-Alive'></span>}
          {status === 'Dead' && <span className='ch-Icon-Dead'></span>}
          {status === 'unknown' && <span className='ch-Icon-unknown'></span>}
          {status}-{species}
        </span>
        <div className='Lastknowlocation'>
          {/* Son bilinen konum */}
          Last know location:
          <div className='text-white'>
            {lastKnownLocation}
          </div>
        </div>
        <div className='Firstseenin'>
          {/* İlk görüldüğü yer */}
          First seen in:
          <div className='text-white'>
            {firstSeen}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
