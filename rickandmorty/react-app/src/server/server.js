// Sabit PORT tanımlanıyor ve 8080 portu kullanılacak
const PORT = 8080;

// axios, express ve cors modülleri import ediliyor
const axios = require('axios');
const express = require("express");
const cors = require('cors');

// express uygulaması oluşturuluyor
const app = express();

// CORS (Cross-Origin Resource Sharing) middleware kullanılıyor
app.use(cors());

// Karakter yöneticisi sınıfı tanımlanıyor
class CharacterManager {
    constructor() {
        // Başlangıçta karakterler null olarak tanımlanıyor
        this.characters = null;
    }

    // Tüm karakterleri çeken asenkron bir fonksiyon tanımlanıyor
    async fetchAllCharacters() {
        try {
            // Rick and Morty API'sinden tüm karakterlerin sayısını ve toplam sayfa sayısını al
            const response = await axios.get('https://rickandmortyapi.com/api/character/');
            const totalCharacters = response.data.info.count;
            const totalPages = response.data.info.pages;

            // Web sitesindeki sayfa sayısını hesapla
            const websitePage = Math.ceil(totalCharacters / 6);

            // Tüm karakterleri çekmek için asenkron istekler yapılıyor
            const charactersPromises = [];
            for (let page = 1; page <= totalPages; page++) {
                charactersPromises.push(axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`));
            }
            const charactersResponses = await Promise.all(charactersPromises);

            // Gelen yanıtlardan karakter verilerini düzleştir
            let charactersData = charactersResponses.flatMap(response => response.data.results);

            // Karakterleri karıştır (rastgele sırala)
            charactersData = charactersData.sort(() => Math.random() - 0.5);

            // Her karakter için ilk görüldüğü yerin bilgisini çek
            this.characters = await Promise.all(charactersData.map(async character => {
                const FirstSeenLocationId = character.episode[0].split('/').pop();
                const FirstSeenLocationResponse = await axios.get(`https://rickandmortyapi.com/api/episode/${FirstSeenLocationId}`);
                const FirstSeenLocation = FirstSeenLocationResponse.data.name;

                // Karakterin özelliklerini yeniden düzenle ve döndür
                return {
                    id: character.id,
                    name: character.name,
                    status: character.status,
                    species: character.species,
                    location: character.location.name,
                    image: character.image,
                    firstSeenLocation: FirstSeenLocation
                };
            }));

            // Tüm karakterleri ve ilgili bilgileri döndür
            return { characters: this.characters, totalPages, totalCharacters, websitePage };
        } catch (error) {
            // Hata durumunda hata fırlat
            throw new Error('API isteği başarısız oldu:', error);
        }
    }
    
    // Karakterleri döndüren bir fonksiyon
    getCharacters() {
        return this.characters || [];
    }
}

// Karakter yöneticisi sınıfından bir nesne oluşturuluyor
const characterManager = new CharacterManager();

// İlk başlatıldığında karakter verilerini çek
characterManager.fetchAllCharacters()
    .then(() => console.log('Karakter verileri başarıyla alındı.'))
    .catch(error => console.error('Karakter verileri alınırken hata oluştu:', error));

// /characters endpoint'ine GET isteği yapıldığında
app.get('/characters', async (req, res) => {
    try {
        // Eğer karakter verileri henüz alınmamışsa veya hata oluşmuşsa, hata mesajı döndür
        if (!characterManager.getCharacters().length) {
            throw new Error('Karakter verileri henüz alınmadı.');
        }

        // Karakter verilerini JSON formatında döndür
        res.json({ characters: characterManager.getCharacters() });
    } catch (error) {
        // Hata durumunda hatayı konsola yaz ve 500 durum kodu ile birlikte hata mesajını JSON olarak döndür
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Uygulama belirtilen PORT üzerinden dinlemeye başlıyor
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
