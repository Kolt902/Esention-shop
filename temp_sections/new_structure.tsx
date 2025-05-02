          {/* Style Categories - MOVED TO TOP */}
          <section className="mb-8">
            <h2 className="text-xl font-normal text-black mb-6 uppercase flex items-center">
              <span className="mr-2">Стили</span>
              <span className="text-sm bg-black text-white px-2 py-0.5">NEW</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Old Money Style */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  handleStyleChange('oldmoney');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/luxury-brands.jpg" 
                  alt="Old Money Style" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white text-xl font-light">Old Money</h3>
                  <p className="text-white/80 text-sm mt-1">Элегантный и сдержанный стиль</p>
                </div>
              </div>
              
              {/* Streetwear Style */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  handleStyleChange('streetwear');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/streetwear-brands.jpg" 
                  alt="Streetwear Style" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white text-xl font-light">Streetwear</h3>
                  <p className="text-white/80 text-sm mt-1">Городской уличный стиль</p>
                </div>
              </div>
              
              {/* Athleisure Style */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  handleStyleChange('athleisure');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/polo-bags.jpg" 
                  alt="Athleisure Style" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white text-xl font-light">Athleisure</h3>
                  <p className="text-white/80 text-sm mt-1">Спортивная эстетика для повседневности</p>
                </div>
              </div>
              
              {/* Luxury Style */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer group rounded-xl shadow-sm hover:shadow-md"
                onClick={() => {
                  handleStyleChange('luxury');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/adidas-tags.jpg" 
                  alt="Luxury Style" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white text-xl font-light">Luxury</h3>
                  <p className="text-white/80 text-sm mt-1">Премиальные бренды и эксклюзивность</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Category Menu - MOVED AFTER STYLES */}
          <section className="mb-8 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="py-5 px-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-semibold text-black uppercase bg-white py-1.5 px-4 rounded-full shadow-sm">Все категории</h4>
                <button 
                  onClick={() => {
                    refetch();
                    queryClient.invalidateQueries({queryKey: ['/api/products']});
                    showNotification('Данные обновлены');
                  }}
                  className="text-black flex items-center text-sm font-medium hover:bg-white px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Обновить
                </button>
              </div>
              <!-- <response clipped>Most of the file structure content was truncated to fit within the tool's output limits.</response>